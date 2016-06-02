/*
	python code:
	a = 1
	print a
*/


/*
pyc_json = {
	co_names:['a'],
	co_consts:[1],
	co_cdoe:[
		['LOAD_CONST',0],
		['STORE_NAME',0],
		['LOAD_NAME',0], 
		['PRINT_ITEM'],
		['PRINT_NEWLINE']  
	]
}
*/

var PyCmp_LT = 0;


function PyListObject(){
	this.vector = new Array()
}


PyListObject.prototype.PyList_SET_ITEM = function PyList_SET_ITEM (index,v){
	this.vector[index] = v;
}

PyListObject.prototype.PyList_GET_ITEM = function PyList_GET_ITEM (index){
	return this.vector[index]?this.vector[index]:null;
}



PyListObject.prototype.__iter__ = function __iter__ (){
	return new PyListIter(this);
}




function PyListIter(associative_list_object){
	this.associative_list_object = associative_list_object;
	this.pos = 0;
}


PyListIter.prototype.next = function netx(){
	return this.associative_list_object.PyList_GET_ITEM(pos++);
}


function PycMachine(pyc_json){
	this.co_code =pyc_json.co_code;
	this.co_names =pyc_json.co_names;
	this.co_consts = pyc_json.co_consts;

	this.instr_offset_map = pyc_json.instr_offset_map;
	this.f_locals = {};
	this.stack=[];
	this.first_instr = null;
	this.next_instr = null;

	this.NEXTOP = function NEXTOP () {
		if (this.next_instr == this.co_code.length){
			return 'STOP_CODE';  
		}
		return this.co_code[this.next_instr++][1];
	}

	this.JUMPTO = function JUMPTO(x){
		this.next_instr = this.instr_offset_map[String(x)];
	}

	this.JUMPBY = function JUMPBY(x){
		this.next_instr =this.next_instr + x;
	}

	this.NEXTARG = function NEXTARG(){
		return this.co_code[this.next_instr-1][2];
	}

	this.PUSH = function PUSH(v){
		this.stack.push(v)
	}

	this.POP = function  POP(){
		return this.stack.pop();
	}

	this.SET_TOP = function SET_TOP(v){
		return this.stack[this.stack.length-1] = v;
	}

	this.TOP = function TOP(){
		return this.stack[this.stack.length-1];
	}

	this.GETITEM = function GETITEM(v,i){
		return v[i];
	}

	this.PyDict_GetItem = function PyDict_GetItem(x,w){
		return x[w];
	}


	this.PyDict_SetItem = function PyDict_SetItem(x,w,v){
		x[w] = v;
	}
}


PycMachine.prototype.run=function(){
	this.first_instr = 0;
	this.next_instr = this.first_instr;
	var opcode = this.NEXTOP();
	var oparg = 0
	var x,w,v;
	var i = 0;
	for(;;){

		i++;

		// console.log(i,opcode);

		if (opcode == 'STOP_CODE'){
			break;
		}

		switch(opcode){
			case 'STOP_CODE':{
				console.log('STOP_CODE');
				break;
			}
			
			case 'LOAD_CONST': {
				oparg = this.NEXTARG(); 
				x = this.GETITEM(this.co_consts,oparg)
				this.PUSH(x);
				opcode = this.NEXTOP();
				break;
			};

			case 'STORE_NAME':{
				oparg = this.NEXTARG(); 
				w = this.GETITEM(this.co_names, oparg);
            	v = this.POP();
            	this.PyDict_SetItem(this.f_locals,w,v);            
				opcode = this.NEXTOP();
				break;
			};

			case 'LOAD_NAME':{
				oparg = this.NEXTARG(); 
				w = this.GETITEM(this.co_names, oparg);
				x = this.PyDict_GetItem(this.f_locals, w);
				this.PUSH(x);
				opcode = this.NEXTOP();
				break;
			};

			case 'PRINT_ITEM':{
				v = this.POP();
				console.log(v);
				opcode = this.NEXTOP();
				break;
			};

			case 'PRINT_NEWLINE':{				 
				opcode = this.NEXTOP();
				break;
			};

			case 'BINARY_ADD':{
				w = this.POP();
                v = this.TOP();
                x = w + v;
                this.SET_TOP(x);
                opcode = this.NEXTOP();
				break;
			};

			case 'COMPARE_OP':{
				w = this.POP();
            	v = this.TOP();
            	oparg = this.NEXTARG(); 
            	switch (oparg) {
                	case PyCmp_LT: x = v < w; break;
                }
                this.SET_TOP(x)
                opcode = this.NEXTOP();
				break;
			};

			case 'POP_JUMP_IF_FALSE':{
				w = this.POP();
				oparg = this.NEXTARG();

				if (w){


				}; 

				if (!w){
					this.JUMPTO(oparg);
				}
				
				opcode = this.NEXTOP();
				break;
			};

			case 'JUMP_FORWARD':{
				oparg = this.NEXTARG(); 

				console.log('JUMP_FORWARD JUMPBY oparg',oparg)
				this.JUMPBY(oparg);
				opcode = this.NEXTOP();
				console.log('JUMP_FORWARD opcode = this.NEXTOP()',opcode)
				break;
			}

			case 'RETURN_VALUE':{
				opcode = this.NEXTOP();
				break;
			}


			case 'SETUP_LOOP':{
				opcode = this.NEXTOP();
				break;
			}

			case 'JUMP_ABSOLUTE':{
				oparg = this.NEXTARG(); 
				this.JUMPTO(oparg);
				opcode = this.NEXTOP();
				break;
			}

			case 'POP_BLOCK':{
				opcode = this.NEXTOP();
				break;
			}

			case 'BUILD_LIST':{
				oparg = this.NEXTARG(); 
				x = new PyListObject();
            	if (x !== null) {
                	for (; --oparg >= 0;) {
                    	w = this.POP();
                    	x.PyList_SET_ITEM(oparg,w);
                	}
                }
                this.PUSH(x)
	            opcode = this.NEXTOP();
				break;
            }

            case 'GET_ITER':{
            	v = TOP();
            	x = v.__iter__();
            	if (x!=null){
            		this.SET_TOP(x);


            	}


            }

		}
	}
}
