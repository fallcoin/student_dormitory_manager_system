// 数据库的增删改查操作
const searchStudent = function(connection, filter = {}) {
    let sql = `select * from student where 1 = 1`
    if (filter.stu_num && filter.stu_num != '')
        sql += ` and stu_num = ${filter.stu_num}`
    if (filter.sex && filter.sex != '')
        sql += ` and sex = '${filter.sex}'`
    if (filter.age && filter.age != '')
        sql += ` and age = '${filter.age}'`
    if (filter.phone && filter.phone != '')
        sql += ` and phone = ${filter.phone}` 
    if (filter.name && filter.name != '')
        sql += ` and name = '${filter.name}'`
    if (filter.grade && filter.grade != '')
        sql += ` and grade = ${filter.grade}`
    if (filter.fac && filter.fac != '')
        sql += ` and fac = '${filter.fac}'`
    if (filter.pages && filter.pages != '')
        sql += ` limit ${(filter.pages - 1) * 10},10`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const updateStudent = function(connection, newStudent) {
    let sql = `update student set `
    if (newStudent.sex && newStudent.sex != '')
        sql += `sex = '${newStudent.sex}',`
    if (newStudent.phone && newStudent.phone != '')
        sql += `phone = '${newStudent.phone}',`
    if (newStudent.age && newStudent.age != '')
        sql += `age = '${newStudent.age}',`
    if (newStudent.name && newStudent.name != '')
        sql += `name = '${newStudent.name}',`
    if (newStudent.grade && newStudent.grade != '')
        sql += `grade = ${newStudent.grade},`
    if (newStudent.fac && newStudent.fac != '')
        sql += `fac = '${newStudent.fac}',`
    sql = sql.slice(0, sql.length - 1)  // 把最后的逗号去掉
    sql += ` where stu_num = ${newStudent.stu_num}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

const insertStudent = function(connection, newStudent) {
    let sqlPre = `insert into student(`
    let sqlTail = `) values(`
    if (newStudent.sex && newStudent.sex != '') {
        sqlPre += 'sex,'
        sqlTail += `'${newStudent.sex}',`
    }
    if (newStudent.phone && newStudent.phone != '') {
        sqlPre += 'phone,'
        sqlTail += `${newStudent.phone},`
    }
    if (newStudent.name && newStudent.name != '') {
        sqlPre += 'name,'
        sqlTail += `'${newStudent.name}',`
    }
    if (newStudent.age && newStudent.age != '') {
        sqlPre += 'age,'
        sqlTail += `${newStudent.age},`
    }
    if (newStudent.grade && newStudent.grade != '') {
        sqlPre += 'grade,'
        sqlTail += `${newStudent.grade},`
    }
    if (newStudent.fac && newStudent.fac != '') {
        sqlPre += 'fac,'
        sqlTail += `'${newStudent.fac}',`
    }
    sqlPre = sqlPre.slice(0, sqlPre.length - 1)
    sqlTail = sqlTail.slice(0, sqlTail.length - 1)
    let sql = sqlPre + sqlTail + ')'
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

const deleteStudent = function(connection, studentId) {
    let sql = `delete from student where stu_num = ${studentId}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result)
        })
    })
}

const searchDormitory = function(connection, filter = {}) {
    let sql = `select * from dormitory where 1 = 1`
    if (filter.dorm_num && filter.dorm_num != '')
        sql += ` and dorm_num = ${filter.dorm_num}`
    if (filter.floor && filter.floor != '')
        sql += ` and floor = ${filter.floor}`
    if (filter.bed_num && filter.bed_num != '')
        sql += ` and bed_num = ${filter.bed_num}`
    if (filter.price && filter.price != '')
        sql += ` and price = ${filter.price}`
    if (filter.ava_bed_num && filter.ava_bed_num != '')
        sql += ` and ava_bed_num = ${filter.ava_bed_num}` 
    if (filter.notFull)
        sql += ` and ava_bed_num >= 1`
    if (filter.pages && filter.pages != '')
        sql += ` limit ${(filter.pages - 1) * 10},10`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const insertDormitory = function(connection, newDomitory) {
    let sqlPre = `insert into dormitory(ava_bed_num,`
    let sqlTail = `) values(4,`
    if (newDomitory.floor && newDomitory.floor != '') {
        sqlPre += 'floor,'
        sqlTail += `${newDomitory.floor},`
    }
    if (newDomitory.price && newDomitory.price != '') {
        sqlPre += 'price,'
        sqlTail += `${newDomitory.price},`
    }
    sqlPre = sqlPre.slice(0, sqlPre.length - 1)
    sqlTail = sqlTail.slice(0, sqlTail.length - 1)
    let sql = sqlPre + sqlTail + ')'
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

const updateDormitory = function(connection, newDomitory) {
    let sql = `update dormitory set `
    if (newDomitory.price && newDomitory.price != '')
        sql += `price = ${newDomitory.price},`
    if (newDomitory.ava_bed_num !== '')
        sql += `ava_bed_num = ${newDomitory.ava_bed_num},`
    sql = sql.slice(0, sql.length - 1)
    sql += ` where dorm_num = ${newDomitory.dorm_num}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

const searchStayInfo = function(connection, filter = {}) {
    let sql = `select * from stay_info where 1 = 1`
    if (filter.dorm_num && filter.dorm_num != '')
        sql += ` and dorm_num = ${filter.dorm_num}`
    if (filter.stu_num && filter.stu_num != '')
        sql += ` and stu_num = ${filter.stu_num}`
    if (filter.preTime && filter.preTime != '' && filter.tailTime && filter.tailTime != '')
        sql += ` and date between '${filter.preTime}' and '${filter.tailTime}'`
    if (filter.pages && filter.pages != '')
        sql += ` limit ${(filter.pages - 1) * 10},10`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const inserStayInfo = function(connection, stayinfo) {
    let sql = `insert into stay_info(stu_num, dorm_num, date) values(${stayinfo.stu_num}, ${stayinfo.dorm_num}, '${stayinfo.date}')`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

const deleteStayInfo = function(connection, stu_num) {
    let sql = `delete from stay_info where stu_num = ${stu_num}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result)
        })
    })
}

const searchModifyInfo = function(connection, filter = {}) {
    let sql = `select * from modify_info where 1 = 1`
    if (filter.stu_num && filter.stu_num != '')
        sql += ` and stu_num = ${filter.stu_num}`
    if (filter.pre_dorm_num && filter.pre_dorm_num != '')
        sql += ` and pre_dorm_num = ${filter.pre_dorm_num}`
    if (filter.ch_dorm_num && filter.ch_dorm_num != '')
        sql += ` and ch_dorm_num = ${filter.ch_dorm_num}`
    if (filter.reason && filter.reason != '')
        sql += ` and reason like '${filter.reason}'`
    if (filter.preTime && filter.preTime != '' && filter.tailTime && filter.tailTime != '')
        sql += ` and date between '${filter.preTime}' and '${filter.tailTime}'`
    if (filter.pages && filter.pages != '')
        sql += ` limit ${(filter.pages - 1) * 10},10`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const insertModifyInfo = function(connection, modifyInfo) {
    let sql = `insert into modify_info(stu_num, pre_dorm_num, ch_dorm_num, date, reason) values(${modifyInfo.stu_num}, ${modifyInfo.pre_dorm_num}, ${modifyInfo.ch_dorm_num}, '${modifyInfo.date}', '${modifyInfo.reason}')`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

const getAllNoStayInfoStudent = function(connection) {
    let sql = `select * from student where stu_num not in(select stu_num from stay_info)`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const searchInOutInfo = function(connection, filter = {}) {
    let sql = `select * from inout_info where 1 = 1`
    if (filter.stu_num && filter.stu_num != '')
        sql += ` and stu_num = ${filter.stu_num}`
    if (filter.dorm_num && filter.dorm_num != '')
        sql += ` and dorm_num = ${filter.dorm_num}`
    if (filter.is_over_time && filter.is_over_time != '')
        sql += ` and is_over_time = '${filter.is_over_time}'`
    if (filter.preInTime && filter.preInTime != '' && filter.tailInTime && filter.tailInTime != '')
        sql += ` and back_time between '${filter.preInTime}' and '${filter.tailInTime}'`
    if (filter.preOutTime && filter.preOutTime != '' && filter.tailOutTime && filter.tailOutTime != '')
        sql += ` and left_time between '${filter.preOutTime}' and '${filter.tailOutTime}'`
    if (filter.pages && filter.pages != '')
        sql += ` limit ${(filter.pages - 1) * 10},10`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const insertInOutInfo = function(connection, inOutInfo) {
    let sqlPre = `insert into inout_info(stu_num, left_time,`
    let sqlTail = `) values(${inOutInfo.stu_num}, '${inOutInfo.left_time}',`
    if (inOutInfo.is_over_time && inOutInfo.is_over_time != '') {
        sqlPre += `is_over_time,`
        sqlTail += `'${inOutInfo.is_over_time}',`
    }
    if (inOutInfo.back_time && inOutInfo.back_time != '') {
        sqlPre += `back_time,`
        sqlTail += `'${inOutInfo.back_time}',`
    }
    sqlPre = sqlPre.slice(0, sqlPre.length - 1)
    sqlTail = sqlTail.slice(0, sqlTail.length - 1)
    let sql = sqlPre + sqlTail + ')'
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

const countMsg = function(connection, table) {
    let sql = `select count(*) as count from ${table}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const deleteModifyInfo = function(connection, stu_num) {
    let sql = `delete from modify_info where stu_num = ${stu_num}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result)
        })
    })
}

const deleteInOutInfo = function(connection, stu_num) {
    let sql = `delete from inout_info where stu_num = ${stu_num}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result)
        })
    })
}

const searchUser = function(connection, user) {
    let sql = `select * from managers where 1 = 1`
    if (user.account && user.account != '')
        sql += ` and account = '${user.account}'`
    if (user.password && user.password != '')
        sql += ` and password = '${user.password}'`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(JSON.stringify(result))
        })
    })
}

const insertUser = function(connection, user) {
    let sql = `insert into managers(account, password) values('${user.account}', '${user.password}')`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
            }
            resolve(result.affectedRows)
        })
    })
}

module.exports = {
    searchStudent,
    updateStudent,
    insertStudent,
    deleteStudent,
    searchDormitory,
    insertDormitory,
    updateDormitory,
    searchStayInfo,
    inserStayInfo,
    searchModifyInfo,
    insertModifyInfo,
    getAllNoStayInfoStudent,
    deleteStayInfo,
    searchInOutInfo,
    insertInOutInfo,
    countMsg,
    deleteModifyInfo,
    deleteInOutInfo,
    searchUser,
    insertUser
}