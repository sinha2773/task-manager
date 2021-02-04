var dbName = 'task_management_db';
var tblName = 'task_tbl';
var db; // db instance
var serverUrl = 'http://localhost/taskmanager/task/add';
let task = {
    init: function(){
        db = new localStorageDB(dbName, tblName);
        task.getList(); // call for listing items
    },
    getList: function(){
        if ( db.tableExists(tblName) ) {
            var results = db.queryAll(tblName);
            console.log(results);
            $('.task-container').html('');
            $.each(results, function(i, v) {
                $('.task-container').append(task.itemHtml(v));
            });
        }
    },
    create: function() {
        // create table if not exists
        if (!db.tableExists(tblName)) {
            db.createTable(tblName, ['task_name', 'task_description', 'datetime']);
        }

        // validation
        $('.alert-msg').hide();
        var task_name = $('.task_name').val();
        var task_description = $('.task_description').val();
        if ( task_name=='' || task_name == null ) {
            $('.alert-msg').html('<div class="error">Please enter task name!</div>').show();
            $('.task_name').focus();
            return false
        }
        if ( task_description=='' || task_description == null ) {
            $('.alert-msg').html('<div class="error">Please enter task description!</div>').show();
            $('.task_description').focus();
            return false
        }

        // data prepare and insert
        var data = { task_name: String(task_name), task_description: String(task_description), datetime: task.getDateTime()};
        data.ID = db.insert(tblName, data); // return latest id
        db.commit();

        // new item added in the list
        $('.task-container').append(task.itemHtml(data));

        // reset form
        $('.task_name').val('');
        $('.task_description').val('');

        // success message
        $('.alert-msg').html('<div class="success">Task has been created successfully!</div>').show();

    },
    delete: function(id){
        if ( !confirm('Are you sure you want to delete?') )
            return false;

        // delete item
        db.deleteRows(tblName, {ID: id});
        db.commit();

        // remove item from list
        $('.task-item-'+id).remove();
    },
    getDateTime: function(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
    },
    itemHtml: function(data) {
        var html = '<div class="task-item task-item-' + data.ID + '">'+
                        '<span onclick="task.delete(' + data.ID + ')" class="close-item">X</span>'+
                        '<div class="task-text">'+
                            '<h3>' + data.task_name + '</h3>'+
                            data.task_description +
                        '</div>'+
                    '</div>';
        return html;
    }
}


jQuery(document).ready(function($){
    task.init(); // task initialize
});