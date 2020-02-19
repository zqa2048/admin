import React,{useState, useEffect} from 'react'
import servicePath from '../config/apiUrl'
import axios from 'axios'
import 'antd/dist/antd.css'
import { Input, Icon, Button, Spin, Card, message, Row, Col ,Result} from 'antd'



function Registered(props) {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const timeOut=()=>{
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }
    
    const checkLogin = () =>{
        setIsLoading(true)
        
        if(!user){
            message.error('用户名不能为空')
            timeOut()
            return false
        }else if(!password){
            message.error('密码不能为空')
            timeOut()
            return false
        }
        let dataProps = {
            'userName':user,
            'password':password
        }
        axios({
            method:'post',
            url:servicePath.checkLogin,
            data:dataProps,
            withCredentials:true
        }).then(
            res=>{
                console.log('user:',res)
                setIsLoading(false)
                if(res.data.data=='登录成功'){
                    localStorage.setItem('openId',res.data.openId)
                    props.history.push('/index/')
                    message.success('恭喜，登录成功!')
                }else{
                    message.error('用户名密码错误 ')
                }
            }
        ).catch(e=>console.log('请求失败:',e))
        timeOut()
    }
    const addUser = ()=>{
        console.log(user,password,password2)
        setIsLoading(true)
        
        if(!user){
            message.error('用户名不能为空')
            timeOut()
            return false
        }else if(!password){
            message.error('密码不能为空')
            timeOut()
            return false
        }else if(!password2){
            message.error('请再次输入密码')
            timeOut()
            return false
        }else if(!(password === password2)){
            message.error('两次密码输入不一致，请确认后再次输入')
            timeOut()
            return false
        }
        let dataProps = {
            'userName':user,
            'password':password,
        }
        axios({
            method:'post',
            url:servicePath.registered,
            data:dataProps,
            withCredentials:true,
            header:{'Access-Control-Allow-Origin': '*'}
        }).then(
            res=>{
                console.log(res.data.isScuccess)
                if(res.data.data=='注册成功'){
                    message.success('恭喜您，注册成功(〃\'▽\'〃)')
                    props.history.push('/index/')
                    console.log('注册成功，跳转ing...')
                    timeOut()
                }
            }
        ).catch(
            err=>console.log(err)
        )
    }
    return (
        <div style={{width:'400px',margin:'150px auto'}}>
            <Spin tip="Loading..." spinning={isLoading} size='large' >
                <Card title="React-blog Admin Login In"
                    bordered='true'
                >
                    <Input
                    id="userName"
                    size='large'
                    placeholder="Enter your userName"
                    prefix={<Icon type='user' style={{color:'rgba(0,0,0,.25)'}} />}
                    onChange={e=>setUser(e.target.value)}
                    />
                    <br/><br/>
                    <Input.Password
                    id="password"
                    size='large'
                    placeholder="Enter your password"
                    prefix={<Icon type='user' style={{color:'rgba(0,0,0,.25)'}} />}
                    onChange={e=>setPassword(e.target.value)}
                    />
                    <br/><br/>
                    <Input.Password
                    id="password"
                    size='large'
                    placeholder="Enter your password again"
                    prefix={<Icon type='user' style={{color:'rgba(0,0,0,.25)'}} />}
                    onChange={e=>setPassword2(e.target.value)}
                    />
                    <br/><br/>
                    <Button type="primary" size='large' block onClick={addUser} >
                        Registered
                    </Button>
                       
                </Card>
            </Spin>
        </div>
    )
}

export default Registered
