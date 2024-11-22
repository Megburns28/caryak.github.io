import './Leaderboard.css';
import carYakLogo from '/CarYak.svg';

const App = () => (
    <>
        <div>
            <a href='http://localhost:5173' target='_blank' rel='noreferrer'>
                <img src={carYakLogo} className='logo' alt='CarYak logo' />
            </a>
        </div>
        <h1>Leaderboard</h1>
    </>
);

export default App;
