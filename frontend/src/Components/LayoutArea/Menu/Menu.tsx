import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import RoleModel from "../../../Models/RoleModel";
import "./Menu.css";

// MUI imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MuiMenu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DeckIcon from '@mui/icons-material/Deck';
import MenuItemModel from "../../../Models/MenuItemModel";

function Menu(): JSX.Element {

    //create different menu options for user and admin
    const userPages = [new MenuItemModel("HOME", <HomeOutlinedIcon />, "/home"), new MenuItemModel("Vacations", <BeachAccessIcon />, "/list")]
    const adminPages = [...userPages, new MenuItemModel("ADD", <AddCircleOutlineIcon />, "/insert"), new MenuItemModel("STATISTICS", <BarChartIcon />, "/statistics")]

    const [user, setUser] = useState<UserModel>();
    const navigate = useNavigate();
    const [pages, setPages] = useState<MenuItemModel[]>([]);

    useEffect(() => {
        const user = authStore.getState().user;
        setUser(user);

        if (user?.roleId === RoleModel.User) setPages(userPages);
        if (user?.roleId === RoleModel.Admin) setPages(adminPages);
        const unsubscribe = authStore.subscribe(() => {
            const user = authStore.getState().user;
            setUser(user);
        });

        return unsubscribe;
    }, [user]);


    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (

        // Fully responsive menu with different option for user and admin
        <AppBar position="sticky" className="Menu" >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {!user && <Typography variant="h4">WELCOME</Typography>}
                    {user && <>
                        <NavLink to="/home">
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                }}
                            >
                                <DeckIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            </Typography>
                        </NavLink>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <MuiMenu
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {/*Toggle menu */}
                                {pages?.map((page) => (

                                    <MenuItem key={page.text} onClick={() => {
                                        navigate(`${page.link}`)
                                        handleCloseNavMenu()
                                    }}>
                                        {page.icon}
                                        <Typography textAlign="center">{page.text}</Typography>
                                    </MenuItem>

                                ))}
                            </MuiMenu>
                        </Box>

                        {/* LOGO */}
                        <NavLink to="/home" >
                            <Typography
                                variant="h5"
                                noWrap

                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                <DeckIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                            </Typography>
                        </NavLink>

                        {/* Full size menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (

                                <Button
                                    key={page.text}
                                    sx={{ my: 2, color: 'white' }}
                                >
                                    <NavLink to={page.link} key={page.text} >
                                        <span className="Icons">{page.icon}</span>
                                        {page.text}
                                    </NavLink>

                                </Button>
                            ))}
                        </Box>

                        {/* Auth Menu */}
                        <Box sx={{ flexGrow: 0 }}>
                            {user &&
                                <AuthMenu />
                            }
                        </Box>
                    </>}
                </Toolbar>
            </Container>
        </AppBar>

    );
}

export default Menu;







