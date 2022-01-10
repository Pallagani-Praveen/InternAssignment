
function Alert({msg,flag}) {
    const color = flag ? 'green' : 'red';
    return (
        <div className="alert" style={{backgroundColor:color}}>
            {msg}
        </div>
    );
}

export default Alert