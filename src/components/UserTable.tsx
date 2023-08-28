import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import User from '../models/User';
import UserStats from '../models/UserStats';
import Tooltip from '@mui/material/Tooltip';

interface UserTableProps {
    users: User[];
    weekStats: { [playerId: string]: UserStats };
}

const UserTable: React.FC<UserTableProps> = ({ users, weekStats }) => {
    const [sortColumn, setSortColumn] = useState<string>('rating');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>('desc');

    const getSortedUsers = () => {
        const sortedUsers = [...users].sort((a, b) => {
            if (sortOrder === 'asc') {
                return (weekStats[a.faceit_id]?.[sortColumn] || 0) - (weekStats[b.faceit_id]?.[sortColumn] || 0);
            } else if (sortOrder === 'desc') {
                return (weekStats[b.faceit_id]?.[sortColumn] || 0) - (weekStats[a.faceit_id]?.[sortColumn] || 0);
            }
            return 0;
        });

        return sortedUsers;
    };

    const sortedUsers = getSortedUsers();

    const handleSort = (column: string) => {
        if (column === sortColumn) {
            setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const setColor = (cs_role: string) => {
        if (cs_role === 'Lurker') {
            return '#6434B2';
        }
        if (cs_role === 'Entry Fragger') {
            return '#B2410D';
        }
        if (cs_role === 'AWPer') {
            return '#46A52A';
        }
        if (cs_role === 'In-Game Leader') {
            return '#6EC1F1';
        }
        if (cs_role === 'Rifler/Support') {
            return '#ED8713';
        }
    };

    return (
        <TableContainer component={Paper} style={{ marginTop: '20px', border: '0px', boxShadow: '0px 0px 0px 0px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Avatar</TableCell>
                        <TableCell onClick={() => handleSort('username')}>
                            Username {sortColumn === 'username' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell onClick={() => handleSort('wins')}>
                            Win {sortColumn === 'wins' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell onClick={() => handleSort('losses')}>
                            Losses {sortColumn === 'losses' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell onClick={() => handleSort('kills')}>
                            Kills {sortColumn === 'kills' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('deaths')}
                        >
                            Deaths {sortColumn === 'deaths' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('assists')}
                        >
                            Assists {sortColumn === 'assists' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('K/D Ratio')}
                        >
                            K/D Ratio {sortColumn === 'K/D Ratio' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('K/R Ratio')}
                        >
                            K/R Ratio {sortColumn === 'K/R Ratio' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('headshots')}
                        >
                            Headshots {sortColumn === 'headshots' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('headshots %')}
                        >
                            Headshots % {sortColumn === 'headshots %' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('MVPs')}
                        >
                            MVPs {sortColumn === 'MVPs' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('tripleKills')}
                        >
                            Triple Kills {sortColumn === 'tripleKills' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('quadroKills')}
                        >
                            Quadro Kills {sortColumn === 'quadroKills' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('pentaKills')}
                        >
                            Penta Kills {sortColumn === 'pentaKills' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('rating')}
                        >
                            Rating {sortColumn === 'rating' && (sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>)}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedUsers.map((user) => (
                        <TableRow key={user.faceit_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Tooltip
                                    title={user.cs_role}
                                    placement="right"
                                    PopperProps={{
                                        sx: {
                                            [`& .MuiTooltip-tooltip`]: {
                                                backgroundColor: setColor(user.cs_role),
                                            }
                                        },
                                    }}
                                >
                                    <img src={user.avatar_url} alt="avatar" width="50" height="50" style={{ borderRadius: '50%' }} />
                                </Tooltip>
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.wins}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.losses}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.kills}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.deaths}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.assists}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.['K/D Ratio']}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.['K/R Ratio']}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.headshots}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.['headshots %']}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.mvps}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.tripleKills}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.quadroKills}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.pentaKills}</TableCell>
                            <TableCell>{weekStats[user.faceit_id]?.rating}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;
