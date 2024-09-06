import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Upload from './components/upload/Upload';
import { Button } from 'antd';
import Download from './components/download/Download';
import { DownloadOutlined, UploadOutlined, HomeOutlined } from '@ant-design/icons';
import Sidebar from './components/sidebar/Sidebar';
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="text-center mt-[20px] mb-[20px] text-[30px] font-bold ">
            <h1>Hello friend this is my private server</h1>
          </div>
        <div className="container">
          <div className="">
            {/* <div className="ml-[45%]">
            <Button className='mr-[10px]' type='primary' icon={<HomeOutlined />}>
              <a href="/">Home</a>
            </Button>
            <Button className='mr-[10px]' icon={<UploadOutlined />}>
              <a href="/upload">Upload</a>
            </Button>
            <Button icon={<DownloadOutlined />}>
              <a href="/download">Download</a>
            </Button>
          </div> */}

            <div className="sidebar">
              <Sidebar />
          </div>
        </div>
          <div className="links">
        <Routes>
          <Route path='/upload' element={<Upload />} />
          <Route path='/download' element={<Download />} />
        </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
