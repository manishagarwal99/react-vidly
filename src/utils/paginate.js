import _ from 'lodash';

export function paginate(items, pageNum, pagesize){
    const startIndex = (pageNum-1)*pagesize;
    return _(items).slice(startIndex).take(pagesize).value();
}