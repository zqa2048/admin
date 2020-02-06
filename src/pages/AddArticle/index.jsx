import React,{useState,useEffect} from 'react'
import './index.css'
import {Row, Col, Input, Select, Button, DatePicker, message} from 'antd'
import marked from 'marked'
import axios from 'axios'
import servicePath from '../../config/apiUrl'
import locale from 'antd/es/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


const {Option} = Select;
const {TextArea} = Input;

export default function Index(props) {
    const [articleId,setArticleId] = useState(0) // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle,setArticleTitle] = useState(' ')   //文章标题
    const [articleContent,setArticleContent]=useState('')  //文章内容
    const [markdownContent,setMarkdownContent]=useState('预览内容') //文章Markdown
    const [introducemd,setIntroducemd]=useState('')            //简介的markdown内容
    const [introducehtml,setIntroducehtml]=useState('等待编辑') //简介的html内容
    const [showDate,setShowDate] = useState(null)   //发布日期
    const [updateDate,setUpdateDate] = useState() //修改日志的日期
    const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType,setSelectType] = useState('选择文章类型') //选择的文章类别
    
    marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  }); 
    
    const getTypeInfo =()=>{
        axios({
            method:'get',
            url:servicePath.getTypeInfo,
            header:{'Access-Control-Allow-Origin':'*'},
            withCredentials:true
        }).then(
            res=>{
                if(res.data.data=='没有登录'){
                    localStorage.removeItem('openId')
                    props.history.push('/')
                }else{
                    setTypeInfo(res.data.data)
                }
            }
        )
    }  
  
    useEffect(() => {
        getTypeInfo()
        let tempId = props.match.params.id
        if (tempId) {
            setArticleId(tempId)
            getArticleById(tempId)
        }
    }, [])
    const changeContent = (e)=>{
       setArticleContent(e.target.value)
       let html=marked(e.target.value)
       setMarkdownContent(html)
   }

   const changeIntroduce = (e)=>{
        setIntroducehtml(e.target.value)
        let html=marked(e.target.value)
        setIntroducemd(html)
    }
    
    const saveArticle = ()=>{
        if(!selectedType){
            message.warning('必须选择文章类别')
            return false
        }else if(!articleTitle){
            message.warning('文章名不能为空')
            return false
        }else if(!articleContent){
            message.warning('文章内容不能为空')
            return false
        }else if(!introducehtml){
            message.warning('简介不能为空')
            return false
        }else if(!showDate){
            message.warning('发布日期不能为空')
            return false
        }
        let dataProps={}
        dataProps.type_id = selectedType
        dataProps.title = articleTitle
        dataProps.article_content = articleContent
        dataProps.introduce = introducehtml
        let dateText = showDate.replace('-','/')
        dataProps.addTime = (new Date(dateText).getTime())/1000
        if(articleId==0){
            console.log('articleId=:',articleId)
            dataProps.view_count = Math.ceil(Math.random()*100)+1000
            axios({
                method:'post',
                url:servicePath.addArticle,
                data:dataProps,
                withCredentials:true
            }).then(
                res=>{
                    setArticleId(res.data.insertId)
                    if(res.data.isOK){
                        message.success('恭喜,文章保存成功!')
                    }else{
                        message.error('文章保存失败!')
                    }
                }
            )
        }else{
            dataProps.id = articleId
            axios({
                method:'post',
                url:servicePath.updateArticle,
                header:{ 'Access-Control-Allow-Origin':'*'},
                data:dataProps,
                withCredentials:true
            }).then(
                res=>{
                    if(res.data.isScuccess){
                        message.success('恭喜,文章保存成功!')
                    }else{
                        message.error('文章保存失败!')
                    }
                }
            )
        }
    }
    
    const getArticleById=(id)=>{
        axios({
            method:'get',
            url:servicePath.getArticleById+id,
            withCredentials:true,
            header:{'Access-Control-Allow-Origin':'*'}
        }).then(
            res=>{
                let sourceData = res.data.data[0]
                setArticleTitle(sourceData.title)
                setArticleContent(sourceData.article_content)
                let html = marked(sourceData.article_content)
                setMarkdownContent(html)
                setIntroducehtml(sourceData.introduce)
                let tempInt = marked(sourceData.introduce)
                setIntroducemd(tempInt)
                setShowDate(sourceData.addTime)
                setSelectType(sourceData.typeId)
            }
        )
    }
    
    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input 
                                placeholder="博客标题"
                                size="large"
                                onChange={e=>setArticleTitle(e.target.value)}
                                onPressEnter={e=>setArticleTitle(e.target.value)}
                                value={articleTitle}
                            />
                        </Col>
                        <Col span={4}>
                            &nbsp;
                            <Select defaultValue={selectedType} value={selectedType} size="large" onChange={e=>{setSelectType(e);console.log(e)}}>
                                {
                                    typeInfo.map((item,index)=>{
                                        return (<Option key={index} value={item.id}>{item.typeName}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea
                                className="markdown-content"
                                rows={35}
                                placeholder="文章内容"
                                onChange={changeContent}
                                onPressEnter={changeContent}
                                value={articleContent}
                            />
                        </Col>
                        <Col span={12}>
                            <div 
                                className="show-html"
                                dangerouslySetInnerHTML={{__html:markdownContent}}
                            >
                                
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size="large">暂存文章</Button>&nbsp;
                            <Button size="large" type="primary" onClick={saveArticle}>发布文章</Button>&nbsp;
                        </Col>
                        <br/>
                        <Col span={24}>
                            <br/>
                            <TextArea
                                rows={4}
                                placeholder="文章简介"
                                onChange={changeIntroduce}
                                onPressEnter={changeIntroduce}
                                value={introducehtml}
                            />
                            <br/><br/>
                            <div className="introduce-html"
                                dangerouslySetInnerHTML={{__html:introducemd}}
                            >
                            </div>
                        </Col>
                        <br/>
                        <Col span={24}>
                            <div className="date-select">
                                <DatePicker 
                                    placeholder="发布时间"
                                    size="large" 
                                    locale={locale}
                                    format="YYYY-MM-DD HH:mm"
                                    allowClear="true"
                                    showTime='true'
                                    defaultValue={moment()}
                                    onChange={(date,dateString)=>{setShowDate(dateString);console.log(dateString,date)}}
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
// console.log(e._d.getTime()