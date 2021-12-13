//import gql from graphql-tag for making queries to our graphql server.
import gql from 'graphql-tag';

//Define your query variable which is the query responsible for retrieving data.
//It will query the each player's position, name, team, jersyNumber, and wonSuperBowl from the query's players field.
const queries = {
    getCategories : (query) => {
        return(`
                query {
                    categories {
                        id
                        name
                        image{
                            url
                        }
                        ${query}
                    }
                }
        `)
    },
    getProducts : (query) =>{
        return(`
            query {
                products{
                    name
                    ${query}
                }
            }
        `)
    },
    getStores : (query = '',condition = '') => (
        `
            query{
                stores(${condition}){
                    id
                    name
                    banner_image
                    ${query}
                }
            }
        `
    ),
    getProduct : (query = '',param) => (
        `
            query{
                    product(id:${param}){
                    name
                    id
                    ${query}
                } 
            }
        `
    ),
    getUsers : (query = '',param) => (
        `query{
            users(${param}){
                username
                id
                type
                firstname
                lastname
                avatar
                phone
                ${query}
            }
        }`
    ),
    getCart : (condition,query) => (
        `query{
            carts(${condition})
              ${query}
        }
        `
    ),
    getOrders : (condition,query) => (
        `query{
            orders(${condition})
                ${query}
        }`
    ),
    getSales : (condition,query) => (
        `query{
            sales(${condition})
                ${query}
        }`
    ),








    updateUser : (param,query,condition) =>(
        `mutation{
            updateUser(input : {
                where : {${condition}}
                data : {${param}}
            }) {
                ${query}
            }
        }` 
    ),

    updateSale : (param,query,condition) =>(
        `mutation{
            updateSale(input : {
                where : {${condition}}
                data : {${param}}
            }) {
                ${query}
            }
        }` 
    ),


    createCard : (data,query = '') =>(
        `mutation{
            createCard(input:{
              data : {
                ${data}
              }
            }){
              ${query}
            }
        }`
    ),
    createCart : (data,query) => (
        `mutation{
            createCart(input : {
                ${data}
            }){
                ${query}
            }
        }`
    ),
    deleteCart : (data,query) =>(
        `mutation{
            deleteCart(input:{
                ${data}
            }){
                ${query}
            }
        }`
    ),
    createSale : (data,query) =>(
        `mutation{
            createSale(input:{
                ${data}
            }){
                ${query}
            }
        }`
    ),
    createDelivery : (data,query) =>(
        `mutation{
            createDelivery(input : {
                ${data}
            }){
                ${query}
            }
        }`
    ),
    createTip : (data,query) => (
        `mutation{
            createTip(input:{
              data : {
                ${data}
              }
            }){
                ${query}
            }
          }`
    ),
    contactSupport : (data,query) => (
        `mutation{
            createSupport(input:{
              data : {
                ${data}
              }
            }){
                ${query}
            }
          }`
    )

    
};
export default queries;