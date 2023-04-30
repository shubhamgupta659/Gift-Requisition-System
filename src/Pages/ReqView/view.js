import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Col, Row } from 'antd';
import axios from 'axios';
import { Select, Modal, Form, Input, Upload, Button, Tooltip } from 'antd';
import { UploadOutlined, RollbackOutlined } from '@ant-design/icons';
import moment from 'moment';
import { AuthContext } from '../../AuthContext';
import ReqStatusPane from '../ReqStatusPane';
const { TextArea } = Input;


function ViewReqAction() {
    const { accessToken } = useContext(AuthContext);
    const [size] = useState('small');
    const navigate = useNavigate();
    const { state } = useLocation();
    const params = useParams();
    const [postResult, setPostResult] = useState(null);
    async function fetchCommentsData() {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "comments",
            "filter": { "requestId": params.id },
            "sort": { "commentId": -1 },
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/find',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            data: msg
        };
        await axios.request(config)
            .then((response) => {
                setPostResult(response.data.documents);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        fetchCommentsData();
    }, []);

    const backButtonHandler = () => {
        navigate(`/${params.stage}`);
    };
    return (
        <div className='view-main-container'>
            <div className='view-status-pane'><ReqStatusPane parentData={postResult} /></div>
            <div>
                <Row>
                    <Col span={12}>
                        <div className='view-form-container'>
                            <div className='view-form-header'>
                                <h2>Request Details</h2>
                            </div>
                            <div className='view-form-sep'><hr></hr></div>

                            <div className='view-form-content'>
                                <table className="striped">
                                    <tbody>
                                        <tr>
                                            <td className='case-label'>Request Id</td>
                                            <td>{state.requestId}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Company Name</td>
                                            <td>{state.companyName}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Contact Name</td>
                                            <td>{state.contactName}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Gift Details</td>
                                            <td>{state.giftDetails.map((value, index) => {
                                                return (
                                                    <div>
                                                        {index === 0 ? <div></div> : <div><hr></hr></div>}
                                                        <tr>
                                                            <td className='case-label'>Gift Id : &nbsp;</td>
                                                            <td>{value.giftId}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='case-label'>Category : &nbsp;</td>
                                                            <td>{value.category}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='case-label'>Item : &nbsp;</td>
                                                            <td>{value.item}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='case-label'>Quantity : &nbsp;</td>
                                                            <td>{value.quantity}</td>
                                                        </tr>
                                                    </div>
                                                );
                                            })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Event Name</td>
                                            <td>{state.eventName}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Event Date</td>
                                            <td>{state.eventDate}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Event Location</td>
                                            <td>{state.eventLocation}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Event Description</td>
                                            <td>{state.eventDescription}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Approver Name</td>
                                            <td>{state.approverName}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Request Date</td>
                                            <td>{state.requestDate}</td>
                                        </tr>
                                        <tr>
                                            <td className='case-label'>Request Status</td>
                                            <td style={{
                                                backgroundColor:
                                                    state.requestStatus === 'Draft'
                                                        ? '#ff9800'
                                                        : state.requestStatus === 'Pending'
                                                            ? '#42a5f5'
                                                            : state.requestStatus.includes('Issue Item')
                                                                ? '#e65100'
                                                                : state.requestStatus.includes('Rejected')
                                                                    ? '#ef5350'
                                                                    : state.requestStatus.includes('Item Issued')
                                                                        ? '#4caf50'
                                                                        : state.requestStatus.includes('Item Gifted')
                                                                            ? '#ba68c8'
                                                                            : '#c62828',
                                                color: '#fff',
                                                display: 'table',
                                            }}>{state.requestStatus}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className='view-form-container'>

                            <div className='view-form-header'>
                                <h2>Review Section</h2>
                                <div className="view-back-button-container"><Tooltip title="Back"><Button shape="round" onClick={backButtonHandler} icon={<RollbackOutlined />} size={size} /></Tooltip></div>
                            </div>
                            <div className='view-form-sep'><hr></hr></div>
                            <ActionCont stage={params.stage} casedata={state} accessToken={accessToken} noofcomments={postResult === null ? 0 : postResult.length} />

                            <div className='view-form-comments-container'>
                                <table className="striped">
                                    <thead>
                                        <tr>
                                            <th className='comment-column-style'>Assigned By</th>
                                            <th className='comment-column-style'>Date</th>
                                            <th className='comment-column-style'>Comment</th>
                                        </tr>
                                    </thead>
                                    <tbody className='comment-body-style'>
                                        {postResult === null ? [].map((c, index) => (
                                            <tr>
                                                <td>{c.assignedBy}</td>
                                                <td>{c.commentDate}</td>
                                                <td>{c.commentMsg}</td>
                                            </tr>
                                        )) : postResult.map((c, index) => (
                                            <tr>
                                                <td>{c.assignedBy}</td>
                                                <td>{c.commentDate}</td>
                                                <td>{c.commentMsg}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

const ActionCont = (props) => {
    if ((props.stage === 'reqDash' && (props.casedata.requestStatus === 'Item Issued'))
        || (props.stage === 'hodDash' && (props.casedata.requestStatus === 'Pending'))
        || (props.stage === 'ssuDash' && (props.casedata.requestStatus === 'Issue Item'))) {
        return (
            <div className='view-select-action-container'>
                <Form>
                    <Form.Item
                        key={1} // Add a unique key for each Form.Item component
                        label="Action"
                        name={`action`} // Use a unique name for each Form.Item component
                        rules={[
                            {
                                required: true,
                                message: 'Please select the action',
                            },
                        ]}
                    >
                        <SelectDrop stage={props.stage} casedata={props.casedata} noofcomments={props.noofcomments} />
                    </Form.Item>
                </Form>
            </div>
        );
    }
};

const SelectDrop = (props) => {
    const navigate = useNavigate();
    const formItems = [];
    const [open, setOpen] = useState(false);
    const [selectedDropValue, setSelectedDropValue] = useState();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const formRef = useRef();
    const [giftInventoryData, setGiftInventoryData] = useState(null);
    const [formData, setFormData] = useState({
        requestId: null,
        commentId: null,
        requestStatus: null,
        commentMsg: null,
        assignedTo: null,
        assignedBy: null,
        commentDate: null,
        attachment: null
    });

    async function fetchGiftInventoryData() {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "giftsInventory",
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/find',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken,
                'Content-Type': 'application/json'
            },
            data: msg
        };

        await axios.request(config)
            .then((response) => {
                setGiftInventoryData(response.data.documents);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchGiftInventoryData();
    }, []);

    async function updateGiftInventoryData(id, quantity) {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "giftsInventory",
            "filter": { "giftId": id },
            "update": {
                "$set": {
                    "quantity": quantity,
                }
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/updateMany',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken,
                'Content-Type': 'application/json'
            },
            data: msg
        };

        await axios.request(config)
            .then((response) => {
                setGiftInventoryData(response.data.documents)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    async function insertComments(data) {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "comments",
            "document": data
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/insertOne',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken,
                'Content-Type': 'application/json',
            },
            data: msg
        };

        await axios.request(config)
            .then((response) => {
                updateCase(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    async function updateCase(data) {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "requests",
            "filter": { "_id": { "$oid": props.casedata._id } },
            "update": {
                "$set": {
                    "requestStatusId": data.requestStatus === 'Issue Item' ? 3 : data.requestStatus === 'Rejected' ? 4 : data.requestStatus === 'Item Issued' ? 5 : data.requestStatus === 'Item Gifted' ? 6 : data.requestStatus === 'Not Gifted' ? 7 : 8,
                    "requestStatus": data.requestStatus,
                    "comment": data.commentMsg,
                    "assignee": data.assignedBy,
                }
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/updateOne',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken,
                'Content-Type': 'application/json',
            },
            data: msg
        };

        await axios.request(config)
            .then((response) => {
                if(data.requestStatus==='Rejected' || data.requestStatus==='Not Gifted'){
                    props.casedata.giftDetails.map((value, index) => {
                        let quantity = 0;
                        giftInventoryData.map((ele)=>{
                                if(ele.giftId === value.giftId){
                                    quantity = Number(ele.quantity) + Number(value.quantity);
                                }
                        })
                        updateGiftInventoryData(value.giftId,quantity);
                    });
                }
                navigate(`/${props.stage}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (formData.commentMsg != null) {
            insertComments(formData);
        }
    }, [formData,giftInventoryData]);

    const s1ActionOptions = [
        { value: 'Item Gifted', label: 'Gift Item' },
        { value: 'Not Gifted', label: 'Not Gifted' },
    ];

    const s2ActionOptions = [
        { value: 'Issue Item', label: 'Approve' },
        { value: 'Rejected', label: 'Reject' },
    ];

    const s3ActionOptions = [
        { value: 'Item Issued', label: 'Issue Item' },
    ];

    const handleSubmit = () => {
        formRef.current.validateFields().then((values) => {
            setFormData({
                "requestId": props.casedata.requestId,
                "commentId": props.noofcomments + 1,
                "requestStatus": values.requestStatus,
                "commentMsg": values.commentMsg,
                "attachment": values.attachment,
                "assignedBy": props.stage === 'reqDash' ? 'Requester' : props.stage === 'hodDash' ? 'HOD' : 'SSU',
                "commentDate": moment(),
            });
        });
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 5000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const handleChange = (value) => {
        setSelectedDropValue(value);
        setOpen(true);
    };

    if (props.stage === 'reqDash') {
        formItems.push(<Select
            defaultValue=""
            onChange={handleChange}
            options={s1ActionOptions}
        />);
    } else if (props.stage === 'hodDash') {
        formItems.push(<Select
            defaultValue=""
            onChange={handleChange}
            options={s2ActionOptions}
        />);
    } else if (props.stage === 'ssuDash') {
        formItems.push(<Select
            defaultValue=""
            onChange={handleChange}
            options={s3ActionOptions}
        />);
    }
    formItems.push(
        <Modal
            title="Enter Comment"
            open={open}
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
        >
            <Form ref={formRef}>
                <Form.Item
                    key={1} // Add a unique key for each Form.Item component
                    label="Case Status"
                    name={`requestStatus`} // Use a unique name for each Form.Item component
                    initialValue={selectedDropValue}
                    rules={[
                        {
                            required: true,
                            message: 'Please select the action',
                        },
                    ]}

                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    key={2} // Add a unique key for each Form.Item component
                    label="Comment"
                    name={`commentMsg`} // Use a unique name for each Form.Item component
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the address',
                        },
                    ]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    key={3}
                    label="Attachment"
                    name="attachment"
                >
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>);
    return formItems;
};

export default ViewReqAction;