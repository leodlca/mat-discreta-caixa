

//            
// VIEW STUFF 
//


$(document).ready(function() {
  const ids = ['#label-2', '#label-5', '#label-10', '#label-20', '#label-50', '#label-100'];

  ids.forEach(id => {
    $(id).click(labelClick);
  });

  $('#prosseguir-btn').click(function(){
    if(!is2Selected()) {
      $('#combinationError').hide();
      return $('#billsError').show();
    }

    let value = $('#value').val();
    const bills = getSelectedBills();

    if (!value) value = 0;

    const algoRes = algorithm(value, bills);

    if(!detectResultError(algoRes)){
      $('#billsError').hide();
      $('#combinationError').show();
    } else if (algoRes[1] === 0) {
      answerModal(value, bills, algoRes);
    }
  });
});

function is2Selected() {
  return $("[type=checkbox]:checked").length == 2;
}

function labelClick() {
  return !is2Selected() || $(this).hasClass("active");
}

function getSelectedBills() {
  let res = [
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER
  ];
  $("[type=checkbox]:checked").each(function(i, item){
    switch(parseInt($(this).attr('name'))){
      case 100:
        res[5] = 100;
        break;
      case 50:
        res[4] = 50;
        break;
      case 20:
        res[3] = 20;
        break;
      case 10:
        res[2] = 10;
        break;
      case 5:
        res[1] = 5;
        break;
      case 2:
        res[0] = 2;
        break;
    }
  });
  return res;
}

function answerModal(value, selectedBills, result){
  clearModal();

  selectedBills = selectedBills.filter(bill => bill <= 100);

  const bills = ['R$ 2,00', 'R$ 5,00', 'R$ 10,00', 'R$ 20,00', 'R$ 50,00', 'R$ 100,00'];

  let html = '<ul>';
  let selectedIndex = 0;

  result[0].forEach((count, i) => {
    if(count > 0){
      html += `<li>${count} nota(s) de ${bills[i]}</li>`;
    }
  });

  html += '</ul>';

  let text = `Resultado para R$ ${value},00 <br><br> <h6>Combinando`;

  selectedBills.forEach((bill, i) => {
    if(i != selectedBills.length - 1){
      text += ` R$ ${bill},00 e`;
    } else{
      text += ` R$ ${bill},00</h6>`;
    }
  });

  $('#modalRespostaH5').html(text);
  $('#modalRespostaBody').html(html);

  $('#billsError').hide();
  $('#combinationError').hide();
  $('#modalResposta').modal('show');
}

function clearModal(){
  $('#modalRespostaH5').empty();
  $('#modalRespostaBody').empty();
}


//                         
// NUMBER PROCESSING STUFF 
//


function detectResultError(result) {
  return result[0].filter(a => a !== 0).length === 2;
}

function algorithm(value, bills){
  const result = [0, 0, 0, 0, 0, 0];

  let filtered_bills = bills.filter(a => a <= 100);

  const mdc = MDC(filtered_bills[0], filtered_bills[1]);
  const max = Math.max.apply(null, filtered_bills);
  const min = Math.min.apply(null, filtered_bills);

  if(value % mdc !== 0){
    return [[], -2];
  }

  do {
    value -= min;
    result[getIndexBill(min)] += 1;
  } while(value % max !== 0 && value > 0);

  while(value > 0) {
    value -= max;
    result[getIndexBill(max)] += 1;
  }

  return [result, value];
}

function getIndexBill(bill){
  const bills = [2, 5, 10, 20, 50, 100];
  return bills.indexOf(bill);
}

function MDC(a, b) {
  let c = -1;
  while(c !== 0){
    c = a % b;
    if(c === b) {
      break;
    }
    a = b;
    b = c
  }
  return a;
}

