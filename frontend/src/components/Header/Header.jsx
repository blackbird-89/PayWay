import React, {useContext} from "react";
import { Row, Col } from 'react-materialize';
import SideMenu from '../SideMenu/SideMenu';
import {UserContext} from '../../AuthUserContext';



const Header = () => {
	const { user } = useContext(UserContext);

    return (
        <React.Fragment>
            <Row>
                <Col node='header' className='header'>
                    <SideMenu user={user} />
                    <p className="logo">PayWay</p>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default Header;