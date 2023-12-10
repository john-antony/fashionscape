import React from "react";

export default function Masonry(props) {
    console.log(props)
    return (
        <div style={{columns: props.columnCount, gutter: 0}}>
            {props.imageUrls.map((img, i) =>
                <img src={`${process.env.PUBLIC_URL}/fits/${img.url}`} alt="" key={i} className="image" style={{padding: props.gap /2}} />
                )}
        </div>
    )
}