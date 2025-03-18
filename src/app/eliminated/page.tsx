import React from 'react';

const EliminatedPage = () => {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            textAlign: 'center' 
        }}>
            <h1>You Are Eliminated</h1>
            <p>Better luck next time!</p>
        </div>
    );
};

export default EliminatedPage;