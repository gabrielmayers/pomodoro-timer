import { HeaderContainer } from "./styles";
import { Timer, Scroll } from "phosphor-react";

import logoPomodoro from "../../assets/logo-pomodoro.png";
import { NavLink } from "react-router-dom";

export function Header() {
    return (
        <HeaderContainer>
            <img src={logoPomodoro} alt="" height={'100px'}/>
            <nav>
                <NavLink to="/" title="Timer" end>
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/history" title="Histórico">
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    );
}