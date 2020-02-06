import React, {useState,createContext} from 'react'
import 'antd/dist/antd.css'
import {Input, Icon, Button, Spin,Card,message} from 'antd'
import servicePath from '../config/apiUrl'
import axios from 'axios'

const openIdContext = createContext()

export default function Login(props) {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    // const checkLogin=()=>{
    //     setIsLoading(true)
    //     console.log("user:",user,'password:',password)
    //     setTimeout(() => {
    //         setIsLoading(false)
    //     }, 1000);
    // }
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
                    <Button type="primary" size='large' block onClick={checkLogin} >
                        Login in
                    </Button>
                </Card>
            </Spin>
        </div>
    )
}
