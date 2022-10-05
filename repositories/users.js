const fs = require('fs');
const crypto = require('crypto');

class UserRepository {
    constructor(filename){
        if(!filename){
            throw new Error('Creating a repository requires a filename');
        }
        this.filename = filename;
        try{
            fs.accessSync(this.filename);
        }catch(err){
            fs.writeFileSync(this.filename, '[]');
        }
    }
    
    async getAll(){
        // Open the file this.filename
        return JSON.parse(await fs.promises.readFile(this.filename, {encoding: 'utf8'}));

    }

    async create(attrs){

        // assigns an id to the attrs object
        attrs.id = this.randomId();

        
        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records);
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));

    }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
}
const test = async () => {
    const repo = new UserRepository('users.json');

    const user = await repo.getOne('adsad');

    console.log(user);
};

test();