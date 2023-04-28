import { useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Form, Input, Select, DatePicker, Button, Tooltip, Collapse, InputNumber, Modal, Space, Table, Tag } from 'antd';
import axios from 'axios';
import moment from "moment";
import { RollbackOutlined } from '@ant-design/icons';
import { AuthContext } from "../../AuthContext";
const { Panel } = Collapse;
const { TextArea } = Input;
const { Search } = Input;


const ReqForm = () => {
    const { accessToken } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();
    const params = useParams();
    const formRef = useRef();
    const [size] = useState('small');
    const itemOptions = [];
    const [giftInventoryData, setGiftInventoryData] = useState(null);
    const [itemOptionUS, setItemOptionUS] = useState([]);
    async function fetchItemsData(category) {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "giftsInventory",
            "filter": { "category": { "$in": [category] } },
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/find',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: msg
        };

        await axios.request(config)
            .then((response) => {
                response.data.documents.map((data) => {
                    itemOptions.push({ "value": data.giftId, "label": data.item });
                });
                setItemOptionUS(itemOptions);
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
                'Authorization': 'Bearer ' + accessToken,
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

    useEffect(() => {

    }, []);

    const [formData, setFormData] = useState({
        requestId: state ? state.requestId : params.id,
        companyName: state ? state.companyName : null,
        contactName: state ? state.contactName : null,
        giftDetails: state ? state.giftDetails : [
            {
                category: null,
                giftId: null,
                item: null,
                quantity: null
            }
        ],
        eventName: state ? state.eventName : null,
        eventDate: state ? state.eventDate : null,
        eventLocation: state ? state.eventLocation : null,
        eventDescription: state ? state.eventDescription : null,
        attachment: state ? state.attachment : null,
        approverName: state ? state.approverName : null,
        requestStatus: null,
        requestStatusId: null,
        requestDate: moment(),
        assignee: 'Requester',
        comment: null
    });

    const priceCategoryOptions = [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
    ];

    const approverOptions = [
        { value: 'Approver 1', label: 'Approver 1' },
        { value: 'Approver 2', label: 'Approver 2' },
        { value: 'Approver 3', label: 'Approver 3' }
    ];

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const openInventoryModal = () => {
        fetchGiftInventoryData();
        setIsModalOpen(true);
    };

    const removeItems = () => {
        const values = [...formData.giftDetails];
        if (values.length > 1) {
            values.splice(values.length - 1, 1);
            setFormData({ ...formData, [`giftDetails`]: values });
        }
    };

    const addItems = () => {
        formRef.current.validateFields().then(() => {
            const values = [...formData.giftDetails];
            values.push({
                category: null,
                giftId: null,
                item: null,
                quantity: null
            })
            setFormData({ ...formData, [`giftDetails`]: values });
        });
    };

    const handleQuantityInputChange = (index) => (event) => {
        const values = [...formData.giftDetails];
        values[index].quantity = event;
        setFormData({ ...formData, [`giftDetails`]: values });
    };

    const handleCategorySelectChange = (index) => (value, event) => {
        const values = [...formData.giftDetails];
        values[index].category = event.label;
        fetchItemsData(event.label);
        setFormData({ ...formData, [`giftDetails`]: values });
    };

    const handleItemSelectChange = (index) => (value, event) => {
        const values = [...formData.giftDetails];
        values[index].giftId = event.value;
        values[index].item = event.label;
        setFormData({ ...formData, [`giftDetails`]: values });
    };

    const handleApproverSelectChange = (index) => (value, event) => {
        console.log(event);
        setFormData({ ...formData, [`approverName`]: event.value });
    };

    const onCompanySearch = (value) => {
        setFormData({ ...formData, [`companyName`]: value });
    };

    const onContactSearch = (value) => {
        setFormData({ ...formData, [`contactName`]: value });
    };

    const dateOnChange = (date, dateString) => {
    };
    const columns = [
        {
            title: 'Gift Id',
            dataIndex: 'giftId',
            key: 'giftId',
        },
        {
            title: 'Vendor Name',
            dataIndex: 'vendorName',
            key: 'vendorName',
            sorter: (a, b) => a.vendorName.length - b.vendorName.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            filters: [
                {
                    text: 'High',
                    value: 'High',
                },
                {
                    text: 'Medium',
                    value: 'Medium',
                },
                {
                    text: 'Low',
                    value: 'Low',
                },
            ],
            onFilter: (value, record) => record.category.indexOf(value) === 0,
        },
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.unitPrice - b.unitPrice,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Ref Id',
            dataIndex: 'refrenceId',
            key: 'refrenceId',
        },
    ];

    const handleSaveDraft = e => {
        formRef.current.validateFields().then((values) => {
            setFormData({
                requestId: formData.requestId,
                companyName: values.companyName,
                contactName: values.contactName,
                giftDetails: formData.giftDetails,
                eventName: values.eventName,
                eventDate: values.eventDate,
                eventLocation: values.eventLocation,
                eventDescription: values.eventDescription,
                attachment: null,
                approverName: values.approverName,
                requestStatus: 'Draft',
                requestStatusId: 1,
                requestDate: formData.requestDate,
                assignee: formData.assignee,
                comment: null
            })
        });
    };

    const handleFormSubmit = () => {
        formRef.current.validateFields().then((values) => {
            setFormData({
                requestId: formData.requestId,
                companyName: values.companyName,
                contactName: values.contactName,
                giftDetails: formData.giftDetails,
                eventName: values.eventName,
                eventDate: values.eventDate,
                eventLocation: values.eventLocation,
                eventDescription: values.eventDescription,
                attachment: null,
                approverName: values.approverName,
                requestStatus: 'Pending',
                requestStatusId: 2,
                requestDate: formData.requestDate,
                assignee: formData.assignee,
                comment: null
            })
        })
    };

    const insertRequest = (data) => {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "requests",
            "document": data
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/insertOne',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            data: msg
        };

        axios.request(config)
            .then((response) => {
                navigate(`/reqDash`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateRequest = (data) => {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "requests",
            "filter": { "_id": { "$oid": state._id } },
            "update": {
                "$set": data
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/updateOne',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            data: msg
        };

        axios.request(config)
            .then((response) => {
                navigate(`/reqDash`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (formData.requestStatus != null) {
            if (params.action === 'add') {
                insertRequest(formData);
            } else {
                updateRequest(formData);
            }
        }
    }, [formData]);

    const backButtonHandler = () => {
        navigate(`/reqDash`);
    };

    return (
        <div className="app-main-container">
            <div className="back-button-container"><Tooltip title="Back"><Button shape="round" onClick={backButtonHandler} icon={<RollbackOutlined />} size={size} /></Tooltip></div>
            <div className="app-header-container"><h4>{params.action === 'add' ? 'Create Request' : 'Edit Request'}</h4></div>
            <div className="app-form-container">
                <Form ref={formRef}>
                    <Collapse defaultActiveKey={['1']} accordion>
                        <Panel header="Recipient Details" key="1">
                            <Form.Item
                                label="Company Name"
                                name={`companyName`}
                                initialValue={formData.companyName}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the company name',
                                    },
                                ]}

                            ><Search name="companyName" placeholder="input search text" onSearch={onCompanySearch} />
                            </Form.Item>
                            <Form.Item
                                label="Contact Name"
                                name={`contactName`}
                                initialValue={formData.contactName}
                                rules={[
                                    { required: true, message: 'Please enter contact name' },
                                ]}

                            ><Search name="contactName" placeholder="input search text" onSearch={onContactSearch} />
                            </Form.Item>
                        </Panel>
                        <Panel header="Gift Details" key="2">
                            {formData.giftDetails.map((field, index) => (
                                <div>
                                    {index === 0 ? <div></div> : <div className="lineBreaker"><hr></hr></div>}
                                    <div key={index}>
                                        <Form.Item
                                            label="Price Category"
                                            name={`category` + index}
                                            rules={[
                                                { required: true, message: 'Please select price Category' },
                                            ]}
                                            initialValue={field.category}
                                        ><Select
                                                name="category"
                                                onChange={handleCategorySelectChange(index)}
                                                options={priceCategoryOptions}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Item"
                                            name={`item` + index}
                                            rules={[
                                                { required: true, message: 'Please select the item' },
                                            ]}
                                            initialValue={field.item}
                                        ><Select
                                                name="item"
                                                onChange={handleItemSelectChange(index)}
                                                options={itemOptionUS}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Quantity"
                                            name={`quantity` + index}
                                            rules={[
                                                { required: true, message: 'Please provide the quantity' },
                                            ]}
                                            initialValue={field.quantity}
                                        ><InputNumber
                                                name="quantity"
                                                defaultValue="1"
                                                min="0"
                                                max="100"
                                                step="1"
                                                onChange={handleQuantityInputChange(index)}
                                                stringMode
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            ))}
                            <div className="gift-button-container">
                                <Button onClick={openInventoryModal}>
                                    View Gift Inventory
                                </Button>
                                <Button type="primary" onClick={removeItems}>
                                    Remove Item
                                </Button>
                                <Button type="primary" onClick={addItems}>
                                    Add Item
                                </Button>
                            </div>
                        </Panel>
                        <Panel header="Event Details" key="3">
                            <Form.Item
                                label="Event Name"
                                name={`eventName`}
                                initialValue={formData.eventName}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter event name',
                                    },
                                ]}

                            ><Input name="eventName" />
                            </Form.Item>
                            <Form.Item
                                label="Event Date"
                                name={`eventDate`}
                                initialValue={formData.eventDate != null ? moment(formData.eventDate) : null}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the date of event',
                                    },
                                ]}
                            >
                                <DatePicker name="eventDate" onChange={dateOnChange} />
                            </Form.Item>
                            <Form.Item
                                label="Event Location"
                                name={`eventLocation`}
                                initialValue={formData.eventLocation}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the event location',
                                    },
                                ]}

                            ><Input name="eventLocation" />
                            </Form.Item>
                            <Form.Item
                                label="Event Description"
                                name={`eventDescription`}
                                initialValue={formData.eventDescription}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the event description',
                                    },
                                ]}
                            >
                                <TextArea name="eventDescription" rows={4} />
                            </Form.Item>
                        </Panel>
                        <Panel header="Approver Details" key="4">
                            <Form.Item
                                label="Approver Name"
                                name={`approverName`}
                                rules={[
                                    { required: true, message: 'Please select an approver' },
                                ]}
                                initialValue={formData.approverName}
                            ><Select
                                    name="approverName"
                                    onChange={handleApproverSelectChange}
                                    options={approverOptions}
                                />
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </Form>
            </div>
            <div className="app-button-container">
                <Button onClick={handleSaveDraft}>
                    Save as Draft
                </Button>
                <Button type="primary" onClick={handleFormSubmit}>
                    Submit
                </Button>
            </div>
            <Modal title="Basic Modal" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000}>
                <p><Table columns={columns} dataSource={giftInventoryData === null ? [] : giftInventoryData} /></p>
            </Modal>
        </div>


    );
}



export default ReqForm;