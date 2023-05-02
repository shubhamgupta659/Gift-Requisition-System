import React, { useMemo, useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
//MRT Imports
import MaterialReactTable from 'material-react-table';

//Material-UI Imports
import {
    Box,
    Tooltip,
    IconButton,
} from '@mui/material';
import { RemoveRedEye, BorderColor } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import ReqStatusPane from '../ReqStatusPane';

const HodDash = () => {
    const { accessToken } = useContext(AuthContext);
    const [postResult, setPostResult] = useState(null);
    async function fetchDashData() {
        let msg = JSON.stringify({
            "dataSource": "Singapore-free-cluster",
            "database": "crsWorkflow",
            "collection": "requests",
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
        fetchDashData();
    }, []);

    const columns = useMemo(
        () => [
            {
                id: 'request', //id used to define `group` column
                header: '',
                columns: [
                    {
                        accessorKey: 'requestId',
                        id: 'requestId', //id is still required when using accessorFn instead of accessorKey
                        header: 'Request Id',
                        size: 50,
                    },
                    {
                        accessorKey: 'companyName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Company Name',
                        size: 150,
                    },
                    {
                        accessorKey: 'contactName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Contact Name',
                        size: 100,
                    },
                    {
                        accessorKey: 'eventName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Event Name',
                        size: 50,
                    },
                    {
                        accessorKey: 'eventDate', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Event Date',
                        size: 100,
                    },
                    {
                        accessorKey: 'eventLocation', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Event Location',
                        size: 50,
                    },
                    {
                        accessorKey: 'eventDescription', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Event Description',
                        size: 300,
                    },
                    {
                        accessorKey: 'approverName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Approver Name',
                        size: 50,
                    },
                    {
                        accessorKey: 'requestorName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Requestor Name',
                        size: 50,
                    },
                    {
                        accessorKey: 'requestStatus', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Request Status',
                        size: 100,
                        Cell: ({ cell }) => (
                            <Box
                                className='box-style'
                                component="span"
                                sx={(theme) => ({
                                    backgroundColor:
                                        cell.getValue() === 'Draft'
                                            ? theme.palette.warning.light
                                            : cell.getValue() === 'Pending'
                                                ? theme.palette.primary.light
                                                : cell.getValue().includes('Issue Item')
                                                    ? theme.palette.warning.dark
                                                    : cell.getValue().includes('Rejected')
                                                        ? theme.palette.error.light
                                                        : cell.getValue().includes('Item Issued')
                                                            ? theme.palette.success.light
                                                            : cell.getValue().includes('Item Gifted')
                                                                ? theme.palette.secondary.light
                                                                : theme.palette.error.dark,
                                    borderRadius: '0.25rem',
                                    display: 'inline-block',
                                    color: '#fff',
                                    minWidth: '12ch !important',
                                    textAlign: 'center !important',
                                    p: '0.5rem',
                                })}
                            >
                                {cell.getValue()}
                            </Box>
                        ),
                    },
                    {
                        accessorKey: 'requestDate', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Request Date',
                        size: 50,
                    },
                    {
                        accessorKey: 'comment', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                        header: 'Comment',
                        size: 50,
                    }
                ],
            }
        ],
        [],
    );


    return (
        <div>
            <div><ReqStatusPane parentData={postResult} stage='hodDash' /></div>
            <div className='mui-table'>
                <MaterialReactTable
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            muiTableHeadCellProps: {
                                align: 'center',
                            },
                            size: 120,
                        },
                    }}
                    enableRowActions
                    columns={columns}
                    data={postResult === null ? [] : postResult}
                    enableColumnFilterModes
                    enableColumnOrdering
                    enableGrouping
                    enablePinning
                    enableRowSelection={false}
                    enableSelectAll={false}
                    initialState={{ showColumnFilters: true, density: 'compact', columnVisibility: { Select: false, requestId: false, eventLocation: false, eventDate: false, eventDescription: false, requestDate: false, comment: false, requestorName: false } }}
                    positionToolbarAlertBanner='bottom'
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <ActionButton row={row.original} />
                        </Box>
                    )}
                />
            </div>
        </div>

    );
};

const ActionButton = (props) => {
    const navigate = useNavigate();
    const onViewClick = (row) => {
        navigate(`/reqview/hodDash/${props.row.requestId}`, { state: props.row });
    };

    if (props.row.requestStatus === 'Pending') {
        return (<Tooltip arrow placement='left' title='Action'>
            <IconButton onClick={() => onViewClick(props.row)}>
                <BorderColor />
            </IconButton>
        </Tooltip>);
    } else {
        return (<Tooltip arrow placement='left' title='View'>
            <IconButton onClick={() => onViewClick(props.row)}>
                <RemoveRedEye />
            </IconButton>
        </Tooltip>);
    }
}

export default HodDash;