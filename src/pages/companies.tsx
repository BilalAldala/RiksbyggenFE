import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Collapse, Paper, Typography, Box
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Axios } from '../config';

interface Company {
    id: number;
    name: string;
}

interface Apartment {
    id: number;
    address: string;
    contractEndDate: string;
    companyId: number;
}

export default function CompaniesTable() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [expandedCompanyIds, setExpandedCompanyIds] = useState<number[]>([]);
    const [apartments, setApartments] = useState<Record<number, Apartment[]>>({});
    const [contractsToExpire, setContractsToExpire] = useState<Record<number, number[]>>({});
    const [filteredCompanyIds, setFilteredCompanyIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await Axios.get('/companies');
                setCompanies(res.data);
            } catch (error) {
                console.error('Error fetching companies', error);
            }
        };
        fetchCompanies();
    }, []);

    const toggleCompany = async (companyId: number) => {
        const isExpanded = expandedCompanyIds.includes(companyId);

        if (isExpanded) {
            setExpandedCompanyIds((companyIds) => companyIds.filter((id) => id !== companyId));
        } else {
            setExpandedCompanyIds((companyIds) => [...companyIds, companyId]);

            if (!apartments[companyId]) {
                try {
                    const res = await Axios.get(`/companies/${companyId}/apartments`);
                    setApartments((allApartments) => ({...allApartments, [companyId]: res.data}));
                } catch (err) {
                    console.error('Error fetching apartments:', err);
                }
            }
        }
    };

    const handleCheckboxChange = async (companyId: number) => {
        const isFiltered = filteredCompanyIds.includes(companyId);

        if (isFiltered) {
            setFilteredCompanyIds((prev) => prev.filter((id) => id !== companyId));
        } else {
            try {
                const res = await Axios.get(`/companies/${companyId}/apartments/contractStatus`);
                const apartmentIds = res.data.map((a: Apartment) => a.id);
                setContractsToExpire((prev) => ({ ...prev, [companyId]: apartmentIds }));
                setFilteredCompanyIds((prev) => [...prev, companyId]);
            } catch (err) {
                console.error('Error fetching contract status:', err);
            }
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Bolag</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {companies.map((company) => {
                        const isExpanded = expandedCompanyIds.includes(company.id);

                        return (
                            <React.Fragment key={company.id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => toggleCompany(company.id)}>
                                            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{company.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ p: 0, border: 0 }}>
                                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                            <Box sx={{ padding: 2 }}>
                                                <Box sx={{ marginBottom: 2 }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={filteredCompanyIds.includes(company.id)}
                                                        onChange={() => handleCheckboxChange(company.id)}
                                                    />
                                                    <span style={{ marginLeft: 8 }}>
                                                        Visa kontrakt som går ut inom 3 månader
                                                    </span>
                                                </Box>

                                                <Typography variant="subtitle1" gutterBottom>
                                                    Lägenheter för {company.name}
                                                </Typography>

                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Adress</TableCell>
                                                            <TableCell>Hyreskontrakt slutdatum</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {apartments[company.id]?.map((apartment) => {
                                                            const isFiltered = filteredCompanyIds.includes(company.id);
                                                            const isInRange = contractsToExpire[company.id]?.includes(apartment.id);
                                                            const rowStyle = isFiltered && !isInRange ? { opacity: 0.4 } : {};

                                                            return (
                                                                <TableRow key={apartment.id} sx={rowStyle}>
                                                                    <TableCell>{apartment.address}</TableCell>
                                                                    <TableCell>{new Date(apartment.contractEndDate).toLocaleDateString()}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
