"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(
    async () => { 
        const { default: RQ } = await import("react-quill");
        return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
    },
    { ssr: false }
);

export default function Quill ({ value, onChange, className }) {
    
    return <ReactQuill className={className} value={value} onChange={onChange}/>;

};
