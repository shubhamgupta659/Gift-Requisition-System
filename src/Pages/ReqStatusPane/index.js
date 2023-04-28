import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Collapse } from 'antd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DraftsIcon from '@mui/icons-material/Drafts';
import ArchiveIcon from '@mui/icons-material/Archive';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import EscalatorIcon from '@mui/icons-material/Escalator';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../AuthContext';
const { Panel } = Collapse;

function ReqStatusPane({ parentData,stage }) {
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [postResult, setPostResult] = useState([]);
    async function fetchStatusCount() {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "requests",
            "pipeline": [
                {
                    "$group": {
                        "_id": {
                            "requestStatus": "$requestStatus",
                            "requestStatusId": "$requestStatusId"
                        },
                        "count": { "$sum": 1 },
                    }
                },
                { "$sort": { "_id.requestStatusId": 1 } }
            ],

        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gqwih/endpoint/data/v1/action/aggregate',
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
        if (parentData) {
            fetchStatusCount();
        }
    }, parentData);

    const onCardClick = (item) => {
        navigate(`/${stage}`);
    };

    return (
        <div className='status-main-container'>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Request Status Count" key="1">
                    <Row className="rowgap-vbox" gutter={[15]}>
                        {postResult.map((c, index) => (
                            <Col
                                key={index}
                                xs={2}
                                className="mb-24"
                                onClick={() => onCardClick(c)}
                            >
                                <Card bordered={true} className="criclebox" style={{
                                    backgroundColor:
                                        c._id.requestStatus === 'Draft'
                                            ? '#ff9800'
                                            : c._id.requestStatus === 'Pending'
                                                ? '#42a5f5'
                                                : c._id.requestStatus.includes('Issue Item')
                                                    ? '#e65100'
                                                    : c._id.requestStatus.includes('Rejected')
                                                        ? '#ef5350'
                                                        : c._id.requestStatus.includes('Item Issued')
                                                            ? '#4caf50'
                                                            : c._id.requestStatus.includes('Item Gifted')
                                                                ? '#ba68c8'
                                                                : '#c62828',
                                    color: '#fff',
                                    textAlign: 'center',
                                }}>
                                    <div className="number" >
                                        <Row align="middle" gutter={[10, 0]}>
                                            <Col className='card-content-container' xs={3}>
                                                <div className='card-title-container'>
                                                    <div className='card-icon-container'>{c._id.requestStatus === 'Draft' ? <DraftsIcon /> : c._id.requestStatus === 'Pending' ? <FileOpenIcon /> : c._id.requestStatus === 'Re-Assign' ? <AssignmentIndIcon /> : c._id.requestStatus === 'Escalated' ? <EscalatorIcon /> : c._id.requestStatus === 'Temp CFF' ? < DeleteIcon /> : c._id.requestStatus === 'CFF' ? < RuleFolderIcon /> : <ArchiveIcon />}</div>
                                                    <div className="icon-box">{c._id.requestStatus}</div>
                                                </div>
                                                <div className='box-line'><hr></hr></div>
                                                <div>{c.count}</div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Panel>
            </Collapse>
        </div >);

}

export default ReqStatusPane;