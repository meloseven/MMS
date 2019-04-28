import React, {useState, useEffect} from 'react';
import Wrapper from './wrapper';
import {Form, Input, Select, Row, Col, Checkbox, Button, message} from 'antd'
import axios from 'axios';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function AddForm(props){
  const {getFieldDecorator} = props.form;
  const handleSubmit = (e) =>{
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        axios.post('/api/project/add', values).then(({data}) =>{
          if(data.code === 200){
            message.success('保存成功');
            history.back();
          }else{
            message.error(data.message);
          }
        })
      }
    })
  }
  const handleCancel = () =>{
    history.back();
  }
  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="项目名称">
        {
          getFieldDecorator('proname', {
            rules: [{
              required: true,
              message: '请输入名称'
            }]
          })(
            <Input/>
          )
        }
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">保存</Button>
        <Button type="default" onClick={handleCancel} style={{marginLeft: '20px'}}>取消</Button>
      </Form.Item>
    </Form>
  )
}

const WrapperForm = Form.create({ name: 'project' })(AddForm);


function ProjectAdd(){
  return (
    <div className="project-add">
      <WrapperForm/>
      <style jsx>{`
        .project-add{
          width: 500px;
          padding-top: 30px;
        }    
      `}</style>
    </div>
  )
}
export default Wrapper(ProjectAdd);