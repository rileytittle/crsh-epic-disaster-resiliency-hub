import "../App.css";

function AccountDetails(props){

    return(
        <>
        <div className="div-account-details-grid">
            <p>email: {props.email}</p>
            <p>phone: {props.phone}</p>
            <p>address: {props.address}</p>
            <p>city: {props.city}</p>
            <p>state: {props.state}</p>
            <p>zip: {props.zip}</p>
        </div>
        </>
    );
    
} export default AccountDetails;