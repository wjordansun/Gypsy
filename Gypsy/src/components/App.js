import { Tabs, Tab } from 'react-bootstrap'
import React, { Component } from 'react';
import Migrations from '../abis/Migrations.json'
import GypsyCity from '../abis/GypsyCity.json'
import Web3 from 'web3';
import './App.css';

class App extends Component {

  async loadBlockchainData(dispatch) {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      
      //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const migrations = new web3.eth.Contract(Migrations.abi, Migrations.networks[netId].address)
        const gypsycity = new web3.eth.Contract(GypsyCity.abi, GypsyCity.networks[netId].address)
        this.setState({migrations, gypsycity})
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    } else {
      window.alert('Please install MetaMask')
    }
  }

  async updateAccount() {
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    this.setState({ account: accounts[0] })
    
    this.checkOwner().then(result => {
      this.setState({isOwner: result})
    })
    
    this.getPropertiesByOwner(this.state.account).then(result => {
      this.setState({ propertyIds: result })
      console.log(this.state.propertyIds)
    })
    
    var properties = []
    console.log(this.state.propertyIds.length)
    for (var i = 0; i < this.state.propertyIds.length; i++) {
      this.getPropertiesDetails(this.state.propertyIds[i]).then(property => {
        if (property !== 0) {
          properties.push(property)
          console.log(property)
          console.log("hello")
          this.setState({properties: properties})
        }
        
      })
    }

    //console.log(properties)
    console.log(this.state.properties)
  }

  async checkOwner() {
    if(this.state.gypsycity!=='undefined'){
      try{
        return this.state.gypsycity.methods.isOwner().call().then(result => { return result })
      } catch (e) {
        console.log('Error, checkOwner: ', e)
      }
    }
  }

  async getPropertiesByOwner(owner) {
    if(this.state.gypsycity!=='undefined'){
      try{
        return this.state.gypsycity.methods.getPropertiesByOwner(owner).call().then(result => { return result })
      } catch (e) {
        console.log('Error, getPropertiesByOwner: ', e)
      }
    }
  }
  
  async getPropertiesDetails(id) {
    if(this.state.gypsycity!=='undefined'){
      try{
        return this.state.gypsycity.methods.properties(id).call().then(result => { return result })
      } catch (e) {
        console.log('Error, getPropertiesDetails: ', e)
      }
    }
  }

  componentDidMount() {
    this.loadBlockchainData(this.props.dispatch)
    this.interval = setInterval(() => this.updateAccount(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }



  constructor(props) {
    
    super(props)
    this.state = {
      interval: null,
      migrations: null,
      gypsycity: null,
      web3: 'undefined',
      propertyIds: [],
      properties: [],
      account: '',
      balance: 0,
      isOwner: false
    }
  }

  async withdraw(e) {
    e.preventDefault()
    if(this.state.gypsycity!=='undefined'){
      try{
        await this.state.gypsycity.methods.withdraw().send({from: this.state.account})
      } catch(e) {
        console.log('Error, withdraw: ', e)
      }
    }
  }

  async createProperty(propertyAddress, rentPrice, price) {
    if(this.state.gypsycity!=='undefined'){
      try {
        console.log(this.state.account)
        this.getPropertiesByOwner(this.state.account).then(function (result) {
          console.log(result)
        })
        await this.state.gypsycity.methods.createProperty(propertyAddress, rentPrice, price)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })
        this.getPropertiesByOwner(this.state.account).then(function (result) {
          console.log(result)
        })

      } catch (e) {
        console.log('Error, creation: ', e)
      }
    }
  }

  async openSale(propertyId) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.openSale(propertyId)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, openSale: ', e)
      }
    }
  }

  async closeSale(propertyId) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.closeSale(propertyId)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, closeSale: ', e)
      }
    }
  }

  async buyProperty(propertyId, payment) {
    if(this.state.gypsycity!=='undefined'){
      try {
        const web3 = new Web3(window.ethereum)
        console.log(web3.utils.toWei(payment.toString(), "ether"))
        await this.state.gypsycity.methods.buyProperty(propertyId)
        .send({ from: this.state.account, value: web3.utils.toWei(payment.toString(), "ether")})
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, buyProperty: ', e)
      }
    }
  }

  async openRent(propertyId) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.openRent(propertyId)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, openRent: ', e)
      }
    }
  }

  async closeRent(propertyId) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.closeRent(propertyId)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, closeRent: ', e)
      }
    }
  }

  async rentProperty(propertyId) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.rentProperty(propertyId)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, rentProperty: ', e)
      }
    }
  }

  async payRent(propertyId, payment) {
    if(this.state.gypsycity!=='undefined'){
      try {
        const web3 = new Web3(window.ethereum)
        await this.state.gypsycity.methods.payRent(propertyId)
        .send({ from: this.state.account, value: web3.utils.toWei(payment.toString(), "ether") })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, payRent: ', e)
      }
    }
  }

  async changePropertyAddress(propertyId, newAddress) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.changePropertyAddress(propertyId, newAddress)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, changePropertyAddress: ', e)
      }
    }
  }

  async changePrice(propertyId, newPrice) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.changePrice(propertyId, newPrice)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, changePrice: ', e)
      }
    }
  }

  async changeRentPrice(propertyId, newRentPrice) {
    if(this.state.gypsycity!=='undefined'){
      try {
        await this.state.gypsycity.methods.changeRentPrice(propertyId, newRentPrice)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })

      } catch (e) {
        console.log('Error, changeRentPrice: ', e)
      }
    }
  }
  
  render() {
    //  const renderTest = () => {
    //   if (this.state.isOwner) {
    //     return <h1> hi </h1>
    //   } else {
    //     return <h1> bye </h1>
    //   }
    // }
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <b>GypsyCity</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to GypsyCity</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="create" title="Create Property">
                  <div>
                  <br></br>
                    Create a property
                    <br></br>
                    (This function can only be called by GypsyCity when it buys a new property)
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let propertyAddress = this.propertyAddress.value
                        let rentPrice = this.rentPrice.value
                        let price = this.price.value
                        console.log()
                        this.createProperty(propertyAddress, rentPrice, price)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='propertyAddress'
                          type='text'
                          ref={(input) => { this.propertyAddress = input }}
                          className="form-control form-control-md"
                          placeholder='propertyAddress...'
                          required />
                        </div>
                        <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='rentPrice'
                          type='number'
                          ref={(input) => { this.rentPrice = input }}
                          className="form-control form-control-md"
                          placeholder='Rent Price...'
                          required />
                        </div>
                        <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='price'
                          type='number'
                          ref={(input) => { this.price = input }}
                          className="form-control form-control-md"
                          placeholder='Price...'
                          required />
                      </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Create Property</button>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <br></br>
                    Gypsy Withdraw
                    <br></br>
                    <br></br>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>Withdraw</button>
                  </div>
                </Tab>
                <Tab eventKey="openSale" title="Open Sale">
                  <div>
                  <br></br>
                    Open the sale of a property
                    <br></br>
                    Please enter the id of the property you want to open the sale for
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let salePropertyId = this.salePropertyId.value
                        console.log(salePropertyId)
                        this.openSale(salePropertyId)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='salePropertyId'
                          type='number'
                          ref={(input) => { this.salePropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Open Sale</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="closeSale" title="Close Sale">
                  <div>
                  <br></br>
                    Close the sale of a property
                    <br></br>
                    Please enter the id of the property you want to close the sale for
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let closeSalePropertyId = this.closeSalePropertyId.value
                        console.log(closeSalePropertyId)
                        this.closeSale(closeSalePropertyId)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='closeSalePropertyId'
                          type='number'
                          ref={(input) => { this.closeSalePropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Close Sale</button>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="buyProperty" title="Buy Property">
                  <div>
                  <br></br>
                    Buy a property
                    <br></br>
                    Please enter the id of the property you want to buy
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let buyPropertyId = this.buyPropertyId.value
                        let buyPayment = this.buyPayment.value
                        console.log(buyPropertyId)
                        this.buyProperty(buyPropertyId, buyPayment)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='buyPropertyId'
                          type='number'
                          ref={(input) => { this.buyPropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                      </div>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='buyPayment'
                          type='number'
                          ref={(input) => { this.buyPayment = input }}
                          className="form-control form-control-md"
                          placeholder='payment...'
                          required />
                      </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Buy Property</button>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="openRent" title="Open Rent">
                  <div>
                  <br></br>
                    Open the rent of a property
                    <br></br>
                    Please enter the id of the property you want to open the rent for
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let openRentPropertyId = this.openRentPropertyId.value
                        console.log(openRentPropertyId)
                        this.openRent(openRentPropertyId)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='openRentPropertyId'
                          type='number'
                          ref={(input) => { this.openRentPropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Open Rent</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="closeRent" title="Close Rent">
                  <div>
                  <br></br>
                    Close the rent of a property
                    <br></br>
                    Please enter the id of the property you want to close the rent for
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let closeRentPropertyId = this.closeRentPropertyId.value
                        console.log(closeRentPropertyId)
                        this.closeRent(closeRentPropertyId)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='closeRentPropertyId'
                          type='number'
                          ref={(input) => { this.closeRentPropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Close Rent</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="rentProperty" title="Rent Property">
                  <div>
                  <br></br>
                    Rent a property
                    <br></br>
                    Please enter the id of the property you want to rent
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let rentPropertyId = this.rentPropertyId.value
                        console.log(rentPropertyId)
                        this.rentProperty(rentPropertyId)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='rentPropertyId'
                          type='number'
                          ref={(input) => { this.rentPropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Rent Property</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="payRent" title="Pay Rent">
                  <div>
                  <br></br>
                    Pay rent
                    <br></br>
                    Please enter the id of the property you need to pay rent for
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let payRentPropertyId = this.payRentPropertyId.value
                        let payRentPayment = this.payRentPayment.value
                        console.log(payRentPropertyId)
                        this.payRent(payRentPropertyId, payRentPayment)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='payRentPropertyId'
                          type='number'
                          ref={(input) => { this.payRentPropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='payRentPayment'
                          type='number'
                          ref={(input) => { this.payRentPayment = input }}
                          className="form-control form-control-md"
                          placeholder='payment...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Pay Rent</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="changePropertyAddress" title="Change Property Address">
                  <div>
                  <br></br>
                    Change the address of a property you own
                    <br></br>
                    Please enter the id of the property and the new address
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let changeAddressPropertyId = this.changeAddressPropertyId.value
                        let newAddress = this.newAddress.value
                        console.log(changeAddressPropertyId)
                        this.changePropertyAddress(changeAddressPropertyId, newAddress)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='changeAddressPropertyId'
                          type='number'
                          ref={(input) => { this.changeAddressPropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='newAddress'
                          type='text'
                          ref={(input) => { this.newAddress = input }}
                          className="form-control form-control-md"
                          placeholder='new address...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Change Address</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="changePrice" title="Change Price">
                  <div>
                  <br></br>
                    Change the price of a property you own
                    <br></br>
                    Please enter the id of the property and the new price
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let changePricePropertyId = this.changePricePropertyId.value
                        let newPrice = this.newPrice.value
                        console.log(changePricePropertyId)
                        this.changePrice(changePricePropertyId, newPrice)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='changePricePropertyId'
                          type='number'
                          ref={(input) => { this.changePricePropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='newPrice'
                          type='number'
                          ref={(input) => { this.newPrice = input }}
                          className="form-control form-control-md"
                          placeholder='new price...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Change Price</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="changeRentPrice" title="Change Rent Price">
                  <div>
                  <br></br>
                    Change the price of a property you own
                    <br></br>
                    Please enter the id of the property and the new price
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let changeRentPricePropertyId = this.changeRentPricePropertyId.value
                        let newRentPrice = this.newRentPrice.value
                        console.log(changeRentPricePropertyId)
                        this.changeRentPrice(changeRentPricePropertyId, newRentPrice)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='changeRentPricePropertyId'
                          type='number'
                          ref={(input) => { this.changeRentPricePropertyId = input }}
                          className="form-control form-control-md"
                          placeholder='propertyId...'
                          required />
                        </div>
                        <div className='form-group mr-sm-2'>
                        <br></br>
                        <input
                          id='newRentPrice'
                          type='number'
                          ref={(input) => { this.newRentPrice = input }}
                          className="form-control form-control-md"
                          placeholder='new rent price...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Change Rent Price</button>
                    </form>
                  </div>
                  </Tab>
                </Tabs>
                <div id="properties">
                  {this.state.properties.map(property => (
                    <ul key={property.propertyAddress}>
                      <li>Property Address:{property.propertyAddress}</li>
                      <li>owner: {property.owner}</li>
                      <li>renter: {property.renter}</li>
                      <li>rentPrice: {property.rentPrice}</li>
                      <li>rentDueTime: {property.rentDueTime}</li>
                      <li>price: {property.price}</li>
                      <li>forSale: {property.forSale.toString()}</li>
                      <li>forRent: {property.forRent.toString()}</li>
                    </ul>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
