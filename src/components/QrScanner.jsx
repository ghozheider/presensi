import Instascan from "instascan";
import React, { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let scanner = new Instascan.Scanner({ video: videoRef.current });

    scanner.addListener("scan", (content) => {
      onScan(content);
    });

    Instascan.Camera.getCameras()
      .then((cameras) => {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error("No cameras found.");
        }
      })
      .catch((e) => console.error(e));

    return () => {
      scanner.stop();
    };
  }, [onScan]);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }} />
    </div>
  );
};

export default QrScanner;
