import './App.css';
import React from 'react';
import request from 'superagent';
import { Segment, Button, Divider, Card, List } from 'semantic-ui-react'

import axios from 'axios';
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';
import 'semantic-ui-css/semantic.min.css';

const CLOUDINARY_UPLOAD_PRESET = 'YOUR_CLOUDINARY_UPLOAD_PRESET';
const CLOUDINARY_UPLOAD_URL = 'CLOUD_NAME';


export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      image: '',
      gallery: []
    };
  }

  componentDidMount() {
    // Request for images tagged xmas       
    axios.get('https://res.cloudinary.com/CLOUD_NAME/image/list/xmas.json')
      .then(res => {
        console.log(res.data.resources);
        this.setState({ gallery: res.data.resources });
      });
  }
//get the image on drop 
  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    //send a request to post it on cloudinary
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
    //in which perset
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      //which file 
      .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          image: response.body.secure_url
        });
      }
    });
  }

  //upload using cloudinary widget 
  uploadWidget() {
    window.cloudinary.openUploadWidget(
      //tags are setin the settings of the repository of your images you are ritriving 
      { cloud_name: 'CLOUD_NAME', upload_preset: 'PRESET_NAME', tags: ['xmas'] },
      function (error, result) {
        // Update gallery state with newly uploaded image
        this.setState({ gallery: this.state.gallery.concat(result) })
      }
    );
  }

  render() {
    return (
      <div>
        <div className="FileUpload" >
          <Segment>
            <br />Welcom to the app developed by me :D
        <Divider clearing />
            <h1>Galleria</h1>
            <div className="upload">
              <Button primary floated='right' onClick={this.uploadWidget.bind(this)} className="upload-button">Add Image</Button>
            </div>
          </Segment>
          <div className="gallery">
            <CloudinaryContext cloudName="CLOUD_NAME">
              {this.state.gallery.map(data => {
                return (
                  <List horizontal>
                    <List.Item>
                      <div className="responsive" key={data.public_id}>
                        <div className="img">
                          <Segment>
                            <Image
                              publicId={data.public_id}
                              responsive
                            >
                              <Transformation
                                width="100"
                                heigt="100"
                                dpr="auto"
                                crop="fill"
                                gravity="face:center"
                                placeholder="blank" /></Image>
                            <Divider section />
                            Created at {data.created_at}
                          </Segment>
                        </div>
                      </div>
                    </List.Item>
                  </List>)
              })
              }
            </CloudinaryContext>
          </div>
        </div>
      </div>);
  }
}