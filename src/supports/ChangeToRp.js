import Numeral from 'numeral'
const ChangeToRp=(num)=>{
    return `Rp.`+Numeral(num).format(0,0)
}

export default ChangeToRp;