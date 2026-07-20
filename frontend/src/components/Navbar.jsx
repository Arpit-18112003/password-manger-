import React from 'react'

const Navbar = ({ username, onLogout }) => {
    return (
        <nav className='bg-slate-800 text-white '>
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">

                <div className="logo font-bold text-white text-2xl">
                    <span className='text-green-500'> &lt;</span>
                    <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
                </div>
                
                <div className='flex items-center gap-4'>
                    {username && (
                        <div className='flex items-center gap-3'>
                            <span className='text-sm text-slate-300'>
                                Welcome, <span className='text-green-400 font-semibold'>{username}</span>
                            </span>
                            <button 
                                onClick={onLogout} 
                                className='bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white px-4 py-1 rounded-full text-xs font-bold shadow-md shadow-red-900/30'
                            >
                                Logout
                            </button>
                        </div>
                    )}
                    <button className='text-white bg-green-700 my-5 rounded-full flex justify-between items-center ring-white ring-1 hover:bg-green-600 transition-all'>
                        <img className='invert w-8 p-1.5' src="/icons/github.svg" alt="github logo" />
                        <span className='font-bold pr-3 pl-1 text-sm'>GitHub</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
