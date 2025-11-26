import { useState } from "react";

export default function useInvoice(onSuccess){
    const [invoiceModalOpen,setInvoiceModalOpen]=useState(false);
    const closeInvoiceModal=()=>setInvoiceModalOpen(false);

    const invoiceCreate = ()=>{
        setInvoiceModalOpen(true);

    }

    return{
        invoiceModalOpen,
        closeInvoiceModal,
        invoiceCreate  
    }
}