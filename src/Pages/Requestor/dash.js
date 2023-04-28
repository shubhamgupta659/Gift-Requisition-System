import React, { useMemo, useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
//MRT Imports
import MaterialReactTable from 'material-react-table';

//Material-UI Imports
import {
  Box,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Edit, RemoveRedEye } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import ReqStatusPane from '../ReqStatusPane';


function ReqDash() {
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [postResult, setPostResult] = useState(null);
  async function fetchRequestsData() {
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
        'Content-Type': 'application/json'
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
    fetchRequestsData();
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

  const onNewCaseClick = () => {
    navigate(`/req/add/${postResult === null ? 1 : postResult.length + 1}`);
  };

  return (

    <div>
      <div><ReqStatusPane parentData={postResult} stage='reqDash' /></div>
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
          initialState={{ showColumnFilters: true, density: 'compact', columnVisibility: { Select: false, requestId: false, eventLocation: false, eventDate: false, eventDescription: false, requestDate: false, comment: false } }}
          positionToolbarAlertBanner='bottom'
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <ActionButton row={row.original} />
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Button
              className='primary'
              variant='contained'
              onClick={() => onNewCaseClick()}
            >
              Create New Request
            </Button>
          )}
        />
      </div>
    </div>
  );
};

const ActionButton = (props) => {
  const navigate = useNavigate();
  const onEditClick = (row) => {
    navigate(`/req/edit/${props.row.requestId}`, { state: props.row });
  };

  const onViewClick = (row) => {
    navigate(`/reqview/reqDash/${props.row.requestId}`, { state: props.row });
  };

  if (props.row.requestStatus === 'Draft') {
    return (<Tooltip arrow placement='left' title='Edit Request'>
      <IconButton onClick={() => onEditClick(props.row)}>
        <Edit />
      </IconButton>
    </Tooltip>
    );
  } else {
    return (<Tooltip arrow placement='left' title='View'>
      <IconButton onClick={() => onViewClick(props.row)}>
        <RemoveRedEye />
      </IconButton>
    </Tooltip>);
  }
}

export default ReqDash;