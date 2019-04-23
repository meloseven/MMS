import React, {useState, useEffect, Fragment} from 'react'
import { Upload, Icon, Modal } from 'antd';

export default function PicUploader({imgUrl, onChange}){
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  useEffect(()=>{
    console.log('1', imgUrl)
    setFileList(imgUrl?[{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: imgUrl,
    }]:[])
  }, [imgUrl])
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传</div>
    </div>
  );
  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl)
    setPreviewVisible(true)
  }
  const handleChange = ({file, fileList}) => {
    if(file.status === 'done'){
      onChange(fileList[0].response.data.imgUrl)
    }
    setFileList([...fileList])
  }
  const handleRemove = ()=>{
    onChange('');
    return true;
  }
  const handleCancel = () => {
    setPreviewVisible(false)
  }
  return (
    <Fragment>
      <Upload
        action="/api/comp/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {fileList.length > 0 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Fragment>
  )
}