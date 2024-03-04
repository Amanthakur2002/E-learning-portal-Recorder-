import  { useState } from "react";
import './Screenrecorder.css'
// import { Button as but } from 'react-bootstrap'
import { Row, Col, Button, Badge } from "antd";
import { useReactMediaRecorder } from "react-media-recorder";
import Text from "antd/lib/typography/Text";
// import S3Upload from "./Uploading"
import AWS from 'aws-sdk';
require("dotenv").config();


// Configure AWS credentials
AWS.config.update({
  region: process.env.region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  });

const ScreenRecording = ({
  screen,
  audio,
  video,
  downloadRecordingPath,
  downloadRecordingType,
  emailToSupport
}) => {
  const [recordingNumber, setRecordingNumber] = useState(0);
  const [data, setData] = useState();

  const RecordView = () => {
    const {
      status,
      startRecording: startRecord,
      stopRecording: stopRecord,
      mediaBlobUrl
    } = useReactMediaRecorder({ screen, audio, video });
const startRecording = () => {
      return startRecord();
    };
const stopRecording = () => {
      const currentTimeSatmp = new Date().getTime();
      setRecordingNumber(currentTimeSatmp);
      return stopRecord();
    };
const viewRecording = () => {
      window.open(mediaBlobUrl, "_blank").focus();
    };
const downloadRecording = () => {
      const pathName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
      const pathName2 = `${recordingNumber}.${downloadRecordingType}`;
      try {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // for IE
          window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
        } else {
          // for Chrome
          const link = document.createElement("a");
          link.href = mediaBlobUrl;
          console.log("mediaBlobUrl",mediaBlobUrl)
          link.download = pathName;
          setData(link.download = pathName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      

// s3 upload begins

const s3 = new AWS.S3();

  
  const uploadToS3 = async () => {
    try {
      const response = await fetch(mediaBlobUrl);
      const blobData = await response.blob();

      // Create a File object with a unique name
      const file = new File([blobData], 'screen-recorded-video.mp4', {
        type: 'video/mp4',
      });

      const timestamp = new Date().getTime(); // Get current timestamp
      const randomString = Math.random().toString(36).substring(2, 15); // Generate a random string
      
      // const uniqueKey = `videos/${timestamp}-${randomString}-${file.originalname}`;
      const uniqueKey = `videos/${timestamp}-${randomString}`;

      // Define the parameters for the S3 upload
  const params = {
    Bucket: process.env.Bucket,
    // Key: `${uniqueKey}.${downloadRecordingType}`,     
    Key: `abhiwali.${downloadRecordingType}`,     
    Body: file,
    ACL: 'public-read', // Set ACL permissions as needed
  };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading file to S3:', err);
        } else {
          console.log('Successfully uploaded file to S3:', data.Location);
        }
      });
    } catch (error) {
      console.error('Error fetching Blob data:', error);
    }
  };
uploadToS3();

// s3 upload ends
        }
      } catch (err) {
        console.error(err);
      }
    };

const mailRecording = () => {
      // try {
      //   window.location.href = `mailTo:${emailToSupport}?subject=Screen recording for an Issue number ${recordingNumber}&body=Hello%20Team,%0D%0A%0D%0A${mediaBlobUrl}`;
      // } catch (err) {
      //   console.error(err);
      // }
    };
return (
     <>
     <div id="background">
<h1>Screen Recorder App</h1>
<div id="recorder">
<div id="recordingstatus">
{/* <Col span="12" style={{ lineHeight: "24px" }}> */}
          <div id="div1">
          {status && status !== "stopped" && (
            <h2>
              Screen Recording Status: {status && status.toUpperCase()}
            </h2>
          )}
          </div>
         <div id="div2">
         {status && status === "recording" && (
            <Badge
              className="screen-recording-badge"
              color="green"
              status="processing"
              offset={[2, 0]}
              style={{
                marginLeft: "5px"
              }}
            />
          )}
         </div>
        {/* </Col> */}
</div>
<div id="startrecording">
{/* <Col span="12" style={{ textAlign: "right" }}> */}
          {status && status !== "recording" && (
            <Button
              size="large"
              onClick={startRecording}
              type="primary"
              // icon="play-circle"
              className="margin-left-sm"
              ghost
            >
              {mediaBlobUrl ? "Record again" : "Start Recording"}
            </Button>
          )}
          {/* </Col > */}
</div>
</div>
<div id="Alloptions">
{status && status === "recording" && (
            <button className="red-button" onClick={stopRecording} >
             Stop recording
            </button>
          )}
         <div id="lastfouroptions">
         {mediaBlobUrl && status && status === "stopped" && (
            <Button
              size="medium"
              onClick={viewRecording}
              type="primary"
              // icon="picture"
              className="viewRecording margin-left-sm"
            >
              View
            </Button>
          )}
          {downloadRecordingType &&
            mediaBlobUrl &&
            status &&
            status === "stopped" && (
              <Button
                size="mediun"
                // onClick={downloadRecording}
                onClick={downloadRecording}
                type="primary"
                // icon="download"
                className="downloadRecording margin-left-sm"
              >
                Download
              </Button>
            )}
          {emailToSupport && mediaBlobUrl && status && status === "stopped" && (
            <Button
              size="medium"
              onClick={mailRecording}
              type="primary"
              // icon="mail"
              className="mailRecording margin-left-sm"
            >
            Send
            </Button>
          )}
         </div>
</div>
{/* <S3Upload/> */}

     </div>
     </>
    );
  };
return (
    <div >
      {RecordView()}

     </div>
  );
};
export default ScreenRecording;