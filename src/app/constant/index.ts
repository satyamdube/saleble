export const CONSTANT = {

    baseUrl : [
      {
        local: 'http://localhost:4200/',
      },{
        dev : 'https://saleable.in/',
      }
    ],
    colorArray : [
        {
          colorCode: '#eb4d4b',
          title: 'red',
        },
        {
          colorCode: '#3e4152',
          title: 'black',
        },
        {
          colorCode: '#fff',
          title: 'white',
        },
        {
          colorCode: '#f8f8f8',
          title: 'gray',
        },
        {
          colorCode: '#badc58',
          title: 'green',
        },
        {
          colorCode: '#A52A2A',
          title: 'brown',
        },
        {
          colorCode: '#f9ca24',
          title: 'yellow',
        },
        {
          colorCode: '#be2edd',
          title: 'pink',
        },
        {
          colorCode: '#f0932b',
          title: 'orange',
        },
    
    ],
    discountRanges: [
        {
            title: '10% and above',
            value: '10'
        },
        {
            title: '20% and above',
            value: '20'
        },
        {
            title: '30% and above',
            value: '30'
        },
        {
            title: '40% and above',
            value: '40'
        },
        {
            title: '50% and above',
            value: '50'
        },
        {
            title: '60% and above',
            value: '60'
        },
        {
            title: '70% and above',
            value: '70'
        },
        {
            title: '80% and above',
            value: '80'
        },
        
    ],
    customerRatings: [
        {
            title: `5`,
        },
        {
            title: `4`,
        },
        {
            title: `3`,
        },
        {
            title: `2`,
        },
        {
            title: `1`,
        },
    ],
    priceRanges: [
      {
        from: 100,
        to: 1000,
       },
       {
        from: 1000,
        to: 3000,
       },
       {
        from: 3000,
        to: 5000,
       },
       {
        from: 5000,
        to: 7000,
       },
       {
        from: 7000,
        to: 9000,
       },
    ],
    cartMessage: [
      {
        msgBehavior: 'Success',
        msg: 'Added To Bag'
      }
    ],
    ratingElements: [
      {
        id: 1,
        title: 'Very Bad',
        point: 1,
      },
      {
        id: 2,
        title: 'Bad',
        point: 2,
      },
      {
        id: 3,
        title: 'Good',
        point: 3,
      },
      {
        id: 4,
        title: 'Very Good',
        point: 4,
      },
      {
        id: 5,
        title: 'Excellent',
        point: 5,
      }
    ],
    outOfStock:{
      title: 'This product is currently sold out',
      slug: 'Out Of Stock'
    },
    cancelReason: [
      {
        title: 'Price for the product has decreased',
       },
      {
        title: 'I want to convert my order to Prepaid',
       },
      {
        title: 'I have changed my mind',
       },
      {
        title: 'Expected delivery time is very long',
       },
      {
        title: 'I want to change my phone number',
       },
      {
        title: 'I have purchased the product elsewhere',
       },
      {
        title: 'Need different size or color',
       },
      {
        title: 'I want to cancel due to product quality issues',
       }

    ]
}