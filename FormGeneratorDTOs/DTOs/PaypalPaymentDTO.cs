using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class PaypalPaymentDTO
    {
        public string PayerID { get; set; }
        public string guid { get; set; }
    }
    public class PaymentDTO
    {
        public string intent { get; set; }
        public Payer payer { get; set; }

        public List<Transaction> transactions { get; set; }

        public RedirectUrls redirect_urls { get; set; }

    }

    public class RedirectUrls
    {
        public string cancel_url { get; set; }
        public string return_url { get; set; }
    }


    public class Payer
    {

        public string payment_method { get; set; }
    }

    public class Transaction
    {
        public string description { get; set; }
        public string invoice_number { get; set; }

        public Amount amount { get; set; }

        public ItemList item_list { get; set; }
    }

    public class Amount
    {

        public string currency { get; set; }
        public string total { get; set; }
        public Details details { get; set; }
    }

    public class Details
    {

        public string tax { get; set; }
        public string shipping { get; set; }
        public string subtotal { get; set; }
    }

    public class ItemList
    {
        public List<Item> items { get; set; }
    }

    public class Item
    {
        public string name { get; set; }
        public string currency { get; set; }
        public string price { get; set; }
        public string quantity { get; set; }
        public string sku { get; set; }
    }





}
