import React, { useState, FormEvent } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from "date-fns";
import { TextField, IconButton, Container, Grid } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Search from '@material-ui/icons/Search';

import './styles.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#003959",
        }
    },
});

export interface Repos {
    id: number;
    name: string;
    created_at: Date;
    description: string;
    language: string;
};

function Home() {
    const [repos, setRepos] = useState([]);
    const [search, setSearch] = useState('');

    async function pesquisarGitHub(e: FormEvent) {
        e.preventDefault();

        if (search) {
            try {
                let retorno = await axios.get(`https://api.github.com/users/${search}/repos`);
                if (retorno.data)
                    setRepos(retorno.data);
            }
            catch (error) {
                alert('Nome de usuário inexistente!');
                setRepos([]);
            }
        }
        else {
            setRepos([]);
        }
    }

    function construirLista() {
        if (repos.length) {
            return repos.map((repo: Repos) => {
                return(
                    <TableRow key={repo.id}>
                        <TableCell component="th" scope="row">{repo.id}</TableCell>
                        <TableCell>{repo.name}</TableCell>
                        <TableCell>{format(new Date(repo.created_at), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{repo.description}</TableCell>
                        <TableCell>{repo.language}</TableCell>
                    </TableRow>
                );
            })
        }
        else {
            return (
                <TableRow>
                    <TableCell colSpan={5}>Não existem resultados</TableCell>
                </TableRow>
            );
        }
    }

    return (
        <div className="wrapper">
            <ThemeProvider theme={theme}>
                <header>
                    <Container className="container top-container">
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="center">
                            <Grid item xs={12} sm={6} className="logo">
                                GitHub Viewer
                            </Grid>
                            <Grid item xs={12} sm={6} container direction="row" justify="flex-end" alignItems="center">
                                <form className="searchs__form" onSubmit={pesquisarGitHub}>
                                    <TextField type="text" id="search" name="search" className="searchs__input" value={search}
                                        onChange={(e) => {setSearch(e.target.value)}} label="Pesquisar Repositório"
                                    />
                                    <IconButton color="primary" aria-label="Pesquisar" size="small" type="submit">
                                        <Search fontSize="small" />
                                    </IconButton>
                                </form>
                            </Grid>
                        </Grid>
                    </Container>
                </header>

                <main>
                    <div className="content">
                        <Container className="container">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell>Nome</TableCell>
                                            <TableCell>Data da Criação</TableCell>
                                            <TableCell>Descrição</TableCell>
                                            <TableCell>Linguagem</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { construirLista() }
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Container>
                    </div>
                </main>

                <footer>
                    <Container className="container">
                        &copy; Camila Kadi Garcia - Todos os direitos reservados - 2020
                    </Container>
                </footer>
            </ThemeProvider>
        </div>
    )
}

export default Home;