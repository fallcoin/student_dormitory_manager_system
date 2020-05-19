const url = require('url')
const { 
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
    insertUser,
    searchUser,
} = require('./sql')
const getToken = require('./token')

module.exports = async function (req, res, connection, filePath) {
    switch (filePath) {
        case '/searchStudent': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            const filter = {...url.parse(req.url, true).query}
            let result
            let count
            try {
                result = await searchStudent(connection, filter)    // 获取结果
                count = await countMsg(connection, 'student')   // 获取总数据的条数
            } catch (error) {
                console.log(error)
            }
            res.end(JSON.stringify({students: JSON.parse(result), ...JSON.parse(count)[0]}))
        }
            break
        case '/modifyStudent': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post = ''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                const newStudent = JSON.parse(post)
                try {
                    await updateStudent(connection, newStudent)
                } catch (error) {
                    console.log(error)
                }
                res.end()
            })
        }
            break
        case '/insertStudent': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post = ''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                const newStudent = JSON.parse(post)
                try {
                    await insertStudent(connection, newStudent)
                } catch (error) {
                    console.log(error)
                }
                res.end()
            })
        }
            break
        case '/deleteStudent': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post = ''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                let students = JSON.parse(post)
                let stuIdArr = students.multipleSelectionId.split(',')
                try {
                    for (const stuId of stuIdArr) {
                        let stuStayInfo = await searchStayInfo(connection, {stu_num: stuId})
                        stuStayInfo = JSON.parse(stuStayInfo)[0]
                        // 宿舍可用床位+1
                        if (stuStayInfo != undefined) {
                            let dormitory = await searchDormitory(connection, {dorm_num: stuStayInfo.dorm_num})
                            dormitory = JSON.parse(dormitory)[0]
                            await updateDormitory(connection, {dorm_num: dormitory.dorm_num, ava_bed_num: dormitory.ava_bed_num + 1})
                        }
                        // 删除宿舍修改信息
                        await deleteModifyInfo(connection, stuId)
                        // 删除宿舍入住信息
                        await deleteStayInfo(connection, stuId)
                        // 删除出入信息
                        await deleteInOutInfo(connection, stuId)
                        // 删除该学生
                        await deleteStudent(connection, stuId)
                    }
                    res.end()
                } catch (error) {
                    console.log(error)
                }
            })
        }
            break
        case '/searchDormitory': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            const filter = {...url.parse(req.url, true).query}
            let result
            let count
            try {
                result = await searchDormitory(connection, filter)
                count = await countMsg(connection, 'dormitory')
            } catch (error) {
                console.log(error)
            }
            res.end(JSON.stringify({dormitorys: JSON.parse(result), ...JSON.parse(count)[0]}))
        }
            break
        case '/insertDormitory': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post =''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                const {num, ...newDomitory} = {...JSON.parse(post)}
                try {
                    for(let i = 0; i < num; i++)
                        await insertDormitory(connection, newDomitory)
                } catch (error) {
                    console.log(error)
                }
                res.end()
            })
        }
            break
        case '/modifyDormitory': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post =''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                let newDomitory = JSON.parse(post)
                try {
                    await updateDormitory(connection, newDomitory)
                } catch (error) {
                    console.log(error)
                }
                res.end()
            })
        }
            break
        case '/seachStayInfo': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            const filter = {...url.parse(req.url, true).query}
            let result1 // 入住表的信息
            let stayInfo = []   // 要返回的数据
            let count   // 数据总条数
            try {
                result1 = await searchStayInfo(connection, filter)  // 查出入住表的信息
                result1 = JSON.parse(result1)
                for (let i = 0; i < result1.length; i++) {
                    let stay = await searchStudent(connection, { stu_num: result1[i].stu_num})  // 根据查出的入住表的每个学号去查学生表
                    stay = JSON.parse(stay)
                    stayInfo.push({name: stay[0].name, fac: stay[0].fac, grade: stay[0].grade, ...result1[i]})  // 进行两个表数据的拼接
                }
                count = await countMsg(connection, 'stay_info')
            } catch (error) {
                console.log(error)
            }
            res.end(JSON.stringify({stayInfo, ...JSON.parse(count)[0]}))
        }
            break
        case '/insertStayInfo': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post =''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                let newStayInfo = JSON.parse(post)
                try {
                    // 查询学生信息
                    let stuInfo = await searchStudent(connection, {stu_num: newStayInfo.stu_num})
                    stuInfo = JSON.parse(stuInfo)[0]
                    if (stuInfo === undefined) {
                        // 无此学生
                        res.end(JSON.stringify({status: 4, msg: '无此学生'}))
                        return
                    }
    
                    // 查询该宿舍信息
                    let dormInfo = await searchDormitory(connection, {dorm_num: newStayInfo.dorm_num})
                    dormInfo = JSON.parse(dormInfo)[0]
                    if (dormInfo === undefined) {
                        // 无此宿舍
                        res.end(JSON.stringify({status: 5, msg: '无此宿舍'}))
                        return
                    }
    
                    // 查询学生入住信息
                    let stuStayInfo = await searchStayInfo(connection, {
                        dorm_num: newStayInfo.stu_num
                    })
                    stuStayInfo = JSON.parse(stuStayInfo)
                    if (stuStayInfo.length !== 0) {
                        // 该学生已经入住了
                        res.end(JSON.stringify({status: 2, msg: '该学生已经入住'}))
                        return
                    }

                    await updateDormitory(connection, Object.assign(dormInfo, {ava_bed_num: dormInfo.ava_bed_num - 1}))
                    await inserStayInfo(connection, newStayInfo)
                    res.end(JSON.stringify({status: 3, msg: '成功分配'}))
                } catch (error) {
                    console.log(error)
                }
            })
        }
            break
        case '/insertAllstudent': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post =''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                let {date, mode} = JSON.parse(post)
                try {
                    let noStayStudents = await getAllNoStayInfoStudent(connection)
                    noStayStudents = JSON.parse(noStayStudents)
                    if (mode === 'grade')
                        noStayStudents = noStayStudents.sort((a, b) => a.grade - b.grade).map(current => current.stu_num)   // 对未入住学生宿舍的人按年级排序
                    else if (mode === 'fac')
                        noStayStudents = noStayStudents.sort((a, b) => a.fac.localeCompare(b.fac)).map(current => current.stu_num)  //  对未入住学生宿舍的人按学院排序
    
                    // 查询出有空余床位的宿舍
                    let notFullDormitorys = await searchDormitory(connection, {notFull: true})
                    notFullDormitorys = JSON.parse(notFullDormitorys)
    
                    // 对有空余床位的宿舍进行遍历
                    for (let i = 0; i < notFullDormitorys.length; i++) {
                        let partStudents = noStayStudents.splice(0, notFullDormitorys[i].ava_bed_num)
                        if (partStudents.length === 0) {
                            break
                        }
                        for (let j = 0; j < partStudents.length; j++) {
                            // 床位数-1
                            await updateDormitory(connection, {...notFullDormitorys[i], ava_bed_num: notFullDormitorys[i].ava_bed_num - 1})
                            // 入住表加一条信息
                            await inserStayInfo(connection, {date, stu_num: partStudents[j], dorm_num: notFullDormitorys[i].dorm_num})
                            notFullDormitorys[i].ava_bed_num -= 1
                        }
                    }
    
                    if (noStayStudents.length > 0) {
                        res.end(JSON.stringify({status: 2, msg: '成功分配部分学生，宿舍不够'}))
                        return
                    }
                    res.end(JSON.stringify({status: 1, msg: '成功分配'}))
                } catch (error) {
                    console.log(error)
                }
            })
        }
            break
        case '/searchModifyInfo': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            const filter = {...url.parse(req.url, true).query}
            let result1 // 调整表的信息
            let modifyInfo = [] // 返回的信息
            let count   // 查出的信息总条数
            try {
                result1 = await searchModifyInfo(connection, filter)    // 查询入住表的信息
                result1 = JSON.parse(result1)
                for (let i = 0; i < result1.length; i++) {
                    let student = await searchStudent(connection, {stu_num: result1[i].stu_num})    // 根据入住表的学号查学生表
                    student = JSON.parse(student)
                    modifyInfo.push({name: student[0].name, ...result1[i]}) // 拼接两个表的信息
                }
                count = await countMsg(connection, 'modify_info')
            } catch (error) {
                console.log(error)
            }
            res.end(JSON.stringify({modifyInfo, ...JSON.parse(count)[0]}))
        }
            break
        case '/insertModifyInfo': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let status  // 1为没有该学生，2为无该宿舍，3为该用户还未入住，4为该宿舍满员，5为成功
            let post =''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                let modifyInfo = JSON.parse(post)
                try {
                    // 查询学生信息
                    let stuInfo = await searchStudent(connection, {stu_num: modifyInfo.stu_num})
                    stuInfo = JSON.parse(stuInfo)[0]
                    if (stuInfo === undefined) {
                        // 无此学生
                        status = 1
                        res.end(JSON.stringify({status: 1, msg: '无此学生'}))
                        return
                    }

                    // 查询调整后的宿舍信息
                    let dormInfo = await searchDormitory(connection, {dorm_num: modifyInfo.ch_dorm_num})
                    dormInfo = JSON.parse(dormInfo)[0]
                    if (dormInfo === undefined) {
                        // 无此宿舍
                        status = 2
                        res.end(JSON.stringify({status: 2, msg: '无此宿舍'}))
                        return
                    }
                    
                    if (dormInfo.ava_bed_num === 0) {
                        status = 4
                        res.end(JSON.stringify({status: 4, msg: '该宿舍已满人'}))
                        return
                    }

                    // 查询学生入住信息
                    let stuStayInfo = await searchStayInfo(connection, {
                        stu_num: modifyInfo.stu_num
                    })
                    stuStayInfo = JSON.parse(stuStayInfo)[0]
                    if (stuStayInfo.length === 0) {
                        // 该学生未入住了
                        status = 3
                        res.end(JSON.stringify({status: 3, msg: '该学生还未入住'}))
                        return
                    } else {
                        modifyInfo.pre_dorm_num = stuStayInfo.dorm_num
                    }

                    // 通过查询原宿舍信息获得原宿舍可用床位
                    let preDormitory = await searchDormitory(connection, {dorm_num: modifyInfo.pre_dorm_num})
                    preDormitory = JSON.parse(preDormitory)[0]
                    // 原宿舍可用床位+1
                    await updateDormitory(connection, {ava_bed_num: preDormitory.ava_bed_num + 1, dorm_num: modifyInfo.pre_dorm_num})
                    // 调整后的宿舍床位-1
                    await updateDormitory(connection, {ava_bed_num: dormInfo.ava_bed_num - 1, dorm_num: dormInfo.dorm_num})
                    // 插入一条修改信息
                    await insertModifyInfo(connection, modifyInfo)
                    // 删除原来的入住信息
                    await deleteStayInfo(connection, modifyInfo.stu_num)
                    // 插入新的入住信息
                    await inserStayInfo(connection, {dorm_num: modifyInfo.ch_dorm_num, stu_num: modifyInfo.stu_num, date: modifyInfo.date})
                    res.end(JSON.stringify({status: 5, msg: '调整成功'}))
                } catch (error) {
                    console.log(error)
                }
            })
        }
            break
        case '/getDetail': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            const {dorm_num} = {...url.parse(req.url, true).query}
            let studentDetail = []  // 该宿舍的所有人的信息
            try {
                let stuNums = await searchStayInfo(connection, {dorm_num})  // 查出该宿舍的所有人的入住表信息
                stuNums = JSON.parse(stuNums).map(current => current.stu_num)   // 获得学号
                for (const stu_num of stuNums) {
                    let student = await searchStudent(connection, {stu_num})    // 查询学生表
                    student = JSON.parse(student)[0]
                    studentDetail.push({stu_num: student.stu_num, name: student.name, grade: student.grade, fac: student.fac})  // 返回学生表部分信息
                }
            } catch (error) {
                console.log(error)
            }
            res.end(JSON.stringify(studentDetail))
        }
            break
        case '/searchInOutInfo': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            const filter = {...url.parse(req.url, true).query}
            let result = [] // 学生出入的具体信息
            let count
            try {
                let result1 = await searchInOutInfo(connection, filter) // 查询出入表
                result1 = JSON.parse(result1)
                for (const inOutInfo of result1) {
                    let result2 = await searchStudent(connection, {stu_num: inOutInfo.stu_num}) // 查询学生表
                    result2 = JSON.parse(result2)[0]
                    let result3 = await searchStayInfo(connection, {stu_num: inOutInfo.stu_num})    // 查询入住表
                    result3 = JSON.parse(result3)[0]
                    result.push({
                        name: result2.name, // 名字
                        dorm_num: result3.dorm_num, // 宿舍号
                        ...inOutInfo
                    })  // 进行拼接
                }
                count = await countMsg(connection, 'inout_info')
            } catch (error) {
                console.log(error)
            }
            res.end(JSON.stringify({inOutInfo: result, ...JSON.parse(count)[0]}))
        }
            break
        case '/insertInOutInfo': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let affectedRows
            let post = ''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                try {
                    const inOutInfo = JSON.parse(post)
                    // 查学生，判断是否存在
                    let result1 = await searchStayInfo(connection, {stu_num: inOutInfo.stu_num})
                    if (result1 == undefined) {
                        res.end(JSON.stringify({status: 1, msg: '该学生不存在或未入住宿舍'}))
                        return
                    }
                    affectedRows = await insertInOutInfo(connection, inOutInfo)
                    res.end(JSON.stringify({status: 2, msg: '登记成功'}))
                } catch (error) {
                    console.log(error)
                }
            })
        }
            break
        case '/login': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post = ''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                const user = JSON.parse(post)
                try {
                    let result = await searchUser(connection, user) // 查询管理员表
                    result = JSON.parse(result)
                    if (result.length == 0) {
                        // 找不到，说明没有该用户或密码错误
                        res.end(JSON.stringify({status: 0, msg: '登录失败，无此用户或密码错误'}))
                    } else {
                        let token = getToken()  // 生成token
                        res.end(JSON.stringify({token, status: 1})) // 返回token，和登录成功的信息
                    }
                } catch (error) {
                    console.log(error)
                }
            })
        }
            break
        case '/register': {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
            let post = ''
            req.on('data', (chunk) => {
                post += chunk
            })
            req.on('end', async () => {
                const user = JSON.parse(post)
                try {
                    let result = await searchUser(connection, {account: user.account})
                    result = JSON.parse(result)
                    if (result.length == 0) {
                        // 该用户不存在，可以注册
                        await insertUser(connection, user)
                        res.end(JSON.stringify({status: 1, msg: '注册成功'}))
                    } else {
                        // 已存在该用户
                        res.end(JSON.stringify({status: 0, msg: '注册失败，该账户已存在'}))
                    }
                } catch (error) {
                    console.log(error)
                }
            })
        }
            break
    }
}