import headerIcon from '../assets/header-icon.svg'
import { NavLink } from './nav-link'
interface HeaderProps {

}
export function Header(props : HeaderProps){
    return(
        <header className="flex items-center gap-5 py-2" >
            <img src={headerIcon} alt="Eventos"/>
            <nav className="flex items-center gap-5 font-medium text-sm" >
                <NavLink href="/eventos">Eventos</NavLink>
                <NavLink href="/Participantes">Participantes</NavLink>
                
               
            </nav>
        </header>
    )
}