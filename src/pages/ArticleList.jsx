import React,{useState, useEffect} from 'react'
import {List, Row, Col, Button, Modal, message, Switch} from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'
const {confirm} = Modal


export default function ArticleList(props) {
    const [list,setList] = useState([])
    const getList = ()=>{
        axios({
            method:'get',
            url:servicePath.getArticleList,
            withCredentials:true,
            header:{'Access-Control-Allow-Origin':'*'}
        }).then(
            res=>{
                setList(res.data.list)
            }
        )
    }
    useEffect(() => {
        getList()
        console.log(list)
    }, [])
    
    const delArticle = (id)=>{
        confirm({
            title: '确定删除这篇文章吗?',
            content: '如果你点击了是的按钮,文章将会永远删除,无法回复!',
            okText:'是的,我确定',
            cancelText:'我在想想!',
            onOk(){
                axios({
                    method:'get',
                    url:servicePath.delArticle+id,
                    withCredentials:true,
                }).then(
                    res=>{
                        message.success('文章删除成功')
                        getList()
                    }
                )
            },
            onCancel(){
                message.success('文章没有任何变化')
            }
        })
    }
    const listDiv={width:'100%'}
    const updateArticle = (id)=>{
        props.history.push('/index/add/'+id)
    }
    return (
        <div>
            <List
            header={
             <Row {...listDiv}>
                        <Col span={8}>
                            <b>标题</b>
                        </Col>
                        <Col span={3}>
                            <b>类别</b>
                        </Col>
                        <Col span={3}>
                            <b>发布时间</b>
                        </Col>
                        <Col span={3}>
                            <b>集数</b>
                        </Col>
                        <Col span={3}>
                            <b>浏览量</b>
                        </Col>

                        <Col span={4}>
                            <b>操作</b>
                        </Col>
                    </Row>

                }
                bordered
                dataSource={list}
                renderItem={item => (
                    <List.Item>
                        <Row style={{width:'100%'}}>
                            <Col span={8}>
                                {item.title}
                            </Col>
                            <Col span={3}>
                             {item.typeName}
                            </Col>
                            <Col span={3}>
                                {item.addTime}
                            </Col>
                            <Col span={3}>
                                共<span>{item.part_count}</span>集
                            </Col>
                            <Col span={3}>
                              {item.view_count}
                            </Col>

                            <Col span={4}>
                              <Button type="primary" onClick={(e)=>updateArticle(item.id)} >修改</Button>&nbsp;

                              <Button onClick={()=>{delArticle(item.id)}}>删除 </Button>
                            </Col>
                        </Row>

                    </List.Item>
                )}
                />

        </div>
    )
}
