import "./init";
import ScreenRecording from "./Screenrecorder"; // Import your ScreenRecording component
import TransparentLogin from "./components/login/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  // Define props to configure screen recording
  const screen = true; // Set to true to record the screen
  const audio = true; // Set to true to include audio
  const video = true; // Set to true to include video
  const downloadRecordingPath = "/path/to/save/recordings"; // Specify the download path
  const downloadRecordingType = "mp4"; // Specify the download file type (e.g., mp4)
  const emailToSupport = "amanthakurdev@example.com"; // Specify the support email address

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ScreenRecording
              screen={screen}
              audio={audio}
              video={video}
              downloadRecordingPath={downloadRecordingPath}
              downloadRecordingType={downloadRecordingType}
              emailToSupport={emailToSupport}
            />
          }
        >
        </Route>
        <Route path="/login" element={<TransparentLogin/>}>

        </Route>
      </Routes>
    </>
  );
}

export default App;
