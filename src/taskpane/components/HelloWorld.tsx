import React from "react";

const HelloWorld: React.FC = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#f5f7fa",
            }}
        >
            <h1
                style={{
                    color: "#2d3748",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                }}
            >
                Hello World
            </h1>
            <p style={{ color: "#4a5568", fontSize: "1.1rem" }}>
                Welcome to your Office Add-in!
            </p>
        </div>
    );
};

export default HelloWorld;