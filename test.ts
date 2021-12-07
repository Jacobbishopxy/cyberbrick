

function fn(nums,target){
    let left=0
    let right=nums.length-1
    while (left<=right) {
        let min=Math.floor((right-left)/2)
        if(target===nums[min]){
            return min;
        }else if(target<nums[min]){
            right=min-1;
        }else if(target>nums[min]){
            left=min+1;
        }
    }
    return -1
}
console.log(fn([2,5],2))  