export class User {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      public companyName: string,
      public companyAddress: string,
      public imageUrl: string,
      public role: string,
      public password: string,
      public phoneNumber: string
    ) {}
  
    updateDetails(data: Partial<Omit<User, 'id' | 'password'>>): void {
      if (data.name) this.name = data.name;
      if (data.email) this.email = data.email;
      if (data.companyName) this.companyName = data.companyName;
      if (data.companyAddress) this.companyAddress = data.companyAddress;
      if (data.imageUrl) this.imageUrl = data.imageUrl;
      if (data.role) this.role = data.role;
      if (data.phoneNumber) this.phoneNumber = data.phoneNumber;
    }

    async validatePassword(plainPassword: string): Promise<boolean> {
        const bcrypt = require('bcrypt'); 
        return bcrypt.compare(plainPassword, this.password);
      }
  }
  