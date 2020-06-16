//BudgetController
var BudgetController=(function(){
    //create Expense object
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    //create Income object
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    //data structure for storing
    var data={
        allItems:{
            inc:[],
            exp:[]
        },
        totals:{
            inc:0,
            exp:0
        },
        budget:0,
        percentage:-1
    };
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(current,index,array){
            sum+=current.value;
        });
        data.totals[type]=sum;
    };

    return{
        addItem:function(type,description,value){
            var newItem,id;
            //calculate the id
            if(data.allItems[type].length>0){
                id=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                id=0;
            }
            //check for the type
            if(type==='exp'){
                newItem=new Expense(id,description,value);
            }
            else{
                newItem=new Income(id,description,value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget:function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget=data.totals.inc-data.totals.exp;
            //calculate the percentage
            if(data.totals.inc>0){
                data.percentage=parseInt(data.totals.exp*100/data.totals.inc);
            }
            else{
                data.percentage="---";
            }
        },
        getbudget:function(){
            return{
                budget:data.budget,
                income:data.totals.inc,
                expenses:data.totals.exp,
                percentage:data.percentage+'%'
            }
        }
    }
})();

//UIController
var UIController=(function(){
    var DOMstring={
        type:'.input_type',
        description:'.input_description',
        value:'.input_value',
        button:'.input_btn',
        input_container:'.income_list',
        expenses_container:'.expenses_list',
        budget_value:'.budget_value',
        income_value:'.income_value',
        expenses_value:'.expenses_value',
        expenses_percentage:'.expenses_percentage'
    };

    return{
        getDOM:function(){
            return DOMstring;
        },
        getInput:function(){
            return{
                type:document.querySelector(DOMstring.type).value,
                description:document.querySelector(DOMstring.description).value,
                value:parseFloat(document.querySelector(DOMstring.value).value)
            }
        },
        addListItem:function(obj,type){
            var html,newhtml,element;
            if(type==='inc'){
                html='<div class="data" id="inc-%id%"><div class="data_description">%description%</div><div class="data_value">%value%</div><div class="data_percentage">---</div><div class="data_delete"><button class="data_delete_btn"><i class="fas fa-times-circle"></i></button></div></div>'
                element=DOMstring.input_container;
            }
            else{
                html='<div class="data" id="exp-%id%"><div class="data_description">%description%</div><div class="data_value">%value%</div><div class="data_percentage">---</div><div class="data_delete"><button class="data_delete_btn"><i class="fas fa-times-circle"></i></button></div></div>'
                element=DOMstring.expenses_container;
            }
            //replacing an html with the obj data
            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%description%',obj.description);
            newhtml=newhtml.replace('%value%',obj.value);

            //add the newhtml to the index.html
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
        },
        clearFields:function(){
            var fields=document.querySelectorAll(DOMstring.description+','+DOMstring.value);
            fields=Array.from(fields);
            fields.forEach(function(current,index,array){
                current.value="";
            });
            fields[0].focus();
        },
        displayBudget:function(obj){
            document.querySelector(DOMstring.budget_value).innerHTML=obj.budget;
            document.querySelector(DOMstring.income_value).innerHTML=obj.income;
            document.querySelector(DOMstring.expenses_value).innerHTML=obj.expenses;
            document.querySelector(DOMstring.expenses_percentage).innerHTML=obj.percentage;
            
        }
    }
})();


//AppController
var Controller=(function(BudgetCtrl,UICtrl){

    var updateBudget=function(){
        //calculate the budget
        BudgetCtrl.calculateBudget();
        //get the budget
        var budget=BudgetCtrl.getbudget();
        //update the budget in the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem=function(){
        var input,newItem;
        //1.get the input 
        input=UICtrl.getInput();
        if(input.description!=='' && !isNaN(input.value) && input.value>0){
            //2.store the data 
            newItem=BudgetCtrl.addItem(input.type,input.description,input.value);
            //3.put the data in the UI
            UICtrl.addListItem(newItem,input.type);
            //4.clear the fields
            UICtrl.clearFields();
            //5.Update the budget
            updateBudget();
            //6.Update the Percentage

        }
    };

    var SetupEventListener=function(){
        var dom=UICtrl.getDOM();
        //clicking and enter key dom manipulation
        document.querySelector(dom.button).addEventListener('click',function(){
            ctrlAddItem();
        });

        document.addEventListener("keypress",function(event){
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem();
                //because by default the type 'click' also get executed by enter key
                event.preventDefault();
            }
        });
    };

    return{
        init:function(){
            //default setup
            UICtrl.displayBudget({budget:"0.00",income:"0.00",expenses:"0.00",percentage:'---'})
            //setting up the event listener
            SetupEventListener();
        }
    }

})(BudgetController,UIController);

Controller.init();