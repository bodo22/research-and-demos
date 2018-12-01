import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import OpenSeaDragon from 'openseadragon';
import ns from '../config/css-ns';

import { focusWindow, } from '../actions';

/**
 * Represents a Window in the mirador workspace
 * @param {object} window
 */
class Window extends Component {
  /**
   * @param {Object} props [description]
   */
  constructor(props) {
    super(props);

    this.miradorInstanceRef = React.createRef();
  }
  /**
   * React lifecycle event
   */
  componentDidMount() {
    if (!this.miradorInstanceRef.current) {
      return false;
    }
    const viewer = OpenSeaDragon({
      id: this.miradorInstanceRef.current.id,
      showNavigationControl: false,
    });
    const that = this;
    fetch(`${this.props.manifest.manifestation.getSequences()[0].getCanvases()[0].getImages()[0].getResource().getServices()[0].id}/info.json`)
      .then(response => response.json())
      .then((json) => {
        viewer.addTiledImage({
          tileSource: json,
          success: (event) => {
            const tiledImage = event.item;

            /**
             * A callback for the tile after its drawn
             * @param  {[type]} e event object
             */
            const tileDrawnHandler = (e) => {
              if (e.tiledImage === tiledImage) {
                viewer.removeHandler('tile-drawn', tileDrawnHandler);
                that.miradorInstanceRef.current.style.display = 'block';
              }
            };
            viewer.addHandler('tile-drawn', tileDrawnHandler);
          },
        });
      })
      .catch(error => console.log(error));
    return false;
  }

  /**
   * Fetches IIIF thumbnail URL
   */
  thumbnail() {
    const thumb = this.props.manifest.manifestation.getThumbnail() || { id: 'http://placekitten.com/200/300' };
    return thumb.id;
  }

  /**
   * Return style attributes
   */
  styleAttributes() {
    let focusedStyle = {};
    if (this.props.isFocused) {
      focusedStyle = {
        borderRadius: this.props.isFocused ? '20px' : '0px',
        fontSize: '30px',
        fontVariant: 'petite-caps',
      }
    }
    // combine the current object with the potential focused styles
    return Object.assign({
        width: `${this.props.window.xywh[2]}px`,
        height: `${this.props.window.xywh[3]}px`,
      },
      focusedStyle
    );
  }

  focusWindow() {
    this.props.focusWindow(this.props.window.id);
  }

  /**
   * Renders things
   * @param {object} props (from react/redux)
   */
  render() {
    return (
      <div className={ns('window')} style={this.styleAttributes()} onClick={this.focusWindow.bind(this)}>
        <div className={ns('window-heading')}>
          <h3>{this.props.manifest.manifestation.getLabel().map(label => label.value)[0]}</h3>
        </div>
        <img src={this.thumbnail()} alt="" />
        <div
          className={ns('osd-container')}
          style={{ display: 'none' }}
          id={`${this.props.window.id}-osd`}
          ref={this.miradorInstanceRef}
        />
      </div>
    );
  }
}

Window.propTypes = {
  window: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  manifest: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

Window.defaultProps = {
  manifest: null,
};

/**
 * mapStateToProps - used to hook up connect to action creators
 * @memberof Window
 * @private
 */
const mapStateToProps = (state, props) => {
  const windows = state.windows;
  const manifests = state.manifests;
  const workspace = state.workspace;
  // getting the 3 parts of the reducer the "quicker" way would go like this:
// const mapStateToProps = ({ windows, manifests, workspace, }, props) => {

  const window = windows.find(win => props.id === win.id);
  return {
    window,
    manifest: manifests[window.manifestId],
    isFocused: window.id === workspace.focusedWindowId
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    focusWindow: id => dispatch(focusWindow(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Window);
