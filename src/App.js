import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Upload from './components/upload/Upload';
import { Button } from 'antd';
import Download from './components/download/Download';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="homepage  w-full">
          <div className="text-center mt-[20px] mb-[20px] text-[30px] font-bold">
            <h1>Hello friend this is my private server</h1>
          </div>
          <div className="ml-[45%]">
            <Button className='mr-[10px]'>
              <a href="/upload">Upload</a>
            </Button>
            <Button>
              <a href="/download">Download</a>
            </Button>
          </div>
        </div>

        <Routes>
          <Route path='/upload' element={<Upload />} />
          <Route path='/download' element={<Download />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
