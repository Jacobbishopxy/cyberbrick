import { Redirect } from 'umi'
import { Modal } from 'antd'
export default (props) => {
    // alert('test')

    // const isLogin = false
    // if (isLogin) {
    //     return <div>{props.children}</div>;
    // } else {
    //     return <Redirect to="/login" />;
    // }
    // return <Modal onOk={() => console.log(444, props)} visible={true}></Modal>
    return props.children
}