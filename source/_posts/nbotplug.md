---
title: onebot2插件源码
tags:
  - python
  - onebot
categories:
  - python
keywords: 插件源码
cover: /temp/img/Maite-Franchi-Forbes-Japan-Australia-Ascending-Editorial.jpg
abbrlink: 2134719b
date: 2022-07-12 21:47:20
---

# 前言
{% tip bell faa-horizontal animated %}注意插件的版本号，有新版本我会同步更新{% endtip %}

{% tip bolt faa-horizontal animated %}公开一些自己写的插件源码，有需要的复制到你的项目中即可{% endtip %}

# 群管系统
- 防撤回已经并入群管系统

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/11 01:13
@Author  : superhero
@Email   : 838210720@qq.com
@File    : group_recall.py
@IDE: PyCharm
"""
import aiofiles
from asyncio import sleep as asleep
from random import randint
from traceback import print_exc
from nonebot.matcher import Matcher
from nonebot import on_notice, on_message, on_request, on_command
import json
import nonebot
from nonebot.adapters.onebot.v11.permission import GROUP_ADMIN, GROUP_OWNER
from nonebot.permission import SUPERUSER
from nonebot.adapters.onebot.exception import ActionFailed
from nonebot.adapters.onebot.v11 import Bot, NoticeEvent, Message, GroupMessageEvent, GroupRequestEvent
from nonebot.adapters import Event
from .config import plugin_config, global_config
from .switch import load, At, MsgText, Reply
import re
import random

bot_name = str(global_config.nickname).split("'")[1] # 获取设置的机器人名字

super = global_config.superusers  # 超管QQ
_path = plugin_config.admin_path
jin_path = plugin_config.jin_path
time_min = plugin_config.ban_rand_time_min
time_max = plugin_config.ban_rand_time_max
group_admin = plugin_config.config_group_admin
answer_list = plugin_config.answer


__help_plugin_name__ = "群管系统"
__help_version__ = '1.4'
__usage__ = '目前支持：\n违禁词检测可自动处罚、加群可以根据答案同意或拒绝、防撤回、禁言、解禁、踢人、拉黑、进群退群提醒、撤回某人n条消息'

f_word = on_message(priority=2, block=False)
@f_word.handle()
async def _(bot: Bot, event: GroupMessageEvent, matcher: Matcher):
    async with aiofiles.open(jin_path, 'r', encoding='utf-8') as f:
        custom_limit_words = await f.read()
        await f.close()
        mid = event.message_id
        gid = event.group_id
        user_id = event.user_id
        funcs_status = (await load(_path))
        if funcs_status.get(str(gid), ''):
            try:
                lf = funcs_status[str(gid)]['违禁词检测']
            except Exception:
                lf = False
                await f_word.finish('还未开启违禁词检测的功能，请输入命令"/开关 违禁词检测"控制开关')
        if lf:
            set_time = random.randint(time_min, time_max)
            time_string = set_timestring(set_time)
            rules = [re.sub(r'\t+', '\t', rule).split('\t') for rule in
                 custom_limit_words.split('\n')]
            msg = re.sub(r'\s', '', str(event.get_message()))
            for rule in rules:
                if rule[0] and re.search(rule[0], msg):
                    matcher.stop_propagation()
                    try:
                        await bot.delete_msg(message_id=mid)
                        await bot.set_group_ban(group_id=gid, user_id=user_id, duration=set_time)
                    except Exception:
                        await f_word.finish(at_sender=True, message=f'你发送了违禁词，待进行禁言{time_string}的处罚，请@管理员处理，将本机器人设为管理员可自动撤回加处罚！')
                    await f_word.finish(at_sender=True, message=f'你发送了违禁词，现在进行禁言{time_string}的处罚，如有异议请联系管理员！')
                    break


group_req = on_request(priority=1)
@group_req.handle()
async def _(bot: Bot, event: GroupRequestEvent):
    raw = json.loads(event.json())
    gid = str(event.group_id)
    flag = raw['flag']
    sub_type = raw['sub_type']
    funcs_status = (await load(_path))
    if funcs_status.get(gid, ''):
        try:
            lf = funcs_status[gid]['加群处理']
        except Exception:
            lf = False
            await group_req.finish('还未开启加群处理的功能，请输入命令"/开关 加群处理"控制开关')
        if lf:
            comment = raw['comment']
            comments = str_right(comment, '答案：') if '答案' in comment else comment
            uid = event.user_id
            if group_admin:
                if len(comments) > plugin_config.answer_int or comments in answer_list:
                    await bot.set_group_add_request(
                        flag=flag,
                        sub_type=sub_type,
                        approve=True,
                        reason=""
                    )
                    await bot.send_msg(group_id=int(gid), message=f'已同意{uid}加入本群，验证消息为“{comment}”')
                else:
                    await bot.set_group_add_request(
                        flag=flag,
                        sub_type=sub_type,
                        approve=False,
                        reason="因回答不符合本群要求自动拒绝！"
                    )
                    await bot.send_msg(group_id=int(gid), message=f'因回答不符本群要求，已拒绝{uid}加入本群，验证消息为“{comment}”')
            else:
                await bot.set_group_add_request(
                    flag=flag,
                    sub_type=sub_type,
                    approve=False,
                    reason="自动拒绝，如有异议请联系管理重新申请！"
                )
                await bot.send_msg(group_id=int(gid), message=f'已拒绝{uid}加入本群，验证消息为“{comment}”')


async def _group_recall(event: NoticeEvent) -> bool:
    if event.notice_type == 'group_recall':
        return True
    return False


group_recall = on_notice(_group_recall, priority=5)
@group_recall.handle()
async def _(bot: Bot, event: NoticeEvent):
    event_obj = json.loads(event.json())
    user_id = event_obj["user_id"]  # 消息发送者
    operator_id = event_obj["operator_id"]  # 撤回消息的人
    group_id = event_obj["group_id"]  # 群号
    message_id = event_obj["message_id"]  # 消息 id
    # print(user_id, message_id, group_id, operator_id)
    # print(event_obj)
    funcs_status = (await load(_path))
    if funcs_status.get(str(group_id), ''):
        try:
            lf = funcs_status[str(group_id)]['防撤回']
        except Exception:
            lf = False
            await group_recall.finish('还未开启防撤回的功能，请输入命令"/开关 防撤回"控制开关')
        if lf:
            if int(user_id) != int(operator_id): return  # 撤回人不是发消息人，是管理员撤回成员消息，不处理
            if int(operator_id) in super or str(operator_id) in super: return  # 发起撤回的人是超管，不处理
            # 管理员撤回自己的不处理
            operator_info = await bot.get_group_member_info(group_id=group_id, user_id=operator_id, no_cache=True)
            # print(operator_info)
            if operator_info["role"] != "member": return
            # 防撤回
            recalled_message = await bot.get_msg(message_id=message_id)
            recall_notice = f"检测到{operator_info['card'] if operator_info['card'] else operator_info['nickname']}({operator_info['user_id']})撤回了一条消息：\n\n"
            await bot.send_group_msg(group_id=group_id, message=recall_notice + recalled_message['message'])
            await group_recall.finish()


welcom = on_notice(priority=5)
@welcom.handle()
async def _(event: Event):
    description = event.get_event_description()
    values = json.loads(description.replace("'", '"'))
    user_id = values['user_id']
    group_id = values["group_id"]
    at_ = "[CQ:at,qq={0}]".format(user_id)

    funcs_status = (await load(_path))
    if funcs_status.get(str(group_id), ''):
        try:
            lf = funcs_status[str(group_id)]['进退提示']
        except Exception:
            lf = False
            await welcom.finish('还未开启进退提示的功能，请输入命令"/开关 进退提示"控制开关')
        if lf:
            if values['notice_type'] == 'group_increase':
                try:
                    lfc = funcs_status[str(group_id)]['违禁词检测']
                except Exception:
                    lfc = False
                we = ''
                if lfc:
                    we = '\n温馨提示：本群已开启违禁词检测，请注意你的言行！'
                msg = at_ + f'欢迎入群，我是最可爱的{bot_name}机器人，有事记得叫我哦!\n输入“/help list”可查看我支持的功能，输入“/开关状态”可查看被动插件开启状态{we}'
                msg = Message(msg)
                await welcom.send(Message(msg))
            elif values['notice_type'] == 'group_decrease':
                if values['sub_type'] == 'leave':
                    msg = at_ + '这位勇士离开了本群，大家快出来送别他吧！'
                    msg = Message(msg)
                    await welcom.send(msg)
                elif values['sub_type'] == 'kick':
                    operator_id = values['operator_id']
                    su = "[CQ:at,qq={0}]".format(operator_id)
                    msg = at_ + '这位勇士被' + su + '踢出了本群，大家快出来瞅瞅！'
                    msg = Message(msg)
                    await welcom.send(msg)
            elif values['notice_type'] == 'notify':
                if values['sub_type'] == 'poke':
                    if values['target_id'] == plugin_config.bot_id:
                        await welcom.send(f"请尽情吩咐{bot_name}吧，主人！")
                try:
                    if values['honor_type'] == 'talkative':
                        msg = '本群新晋龙王是' + at_
                        await welcom.send(Message(msg))
                    elif values['honor_type'] == 'performer':
                        msg = '本群新晋群聊之火是' + at_
                        await welcom.send(Message(msg))
                    elif values['honor_type'] == 'emotion':
                        msg = '本群新晋快乐源泉是' + at_
                        await welcom.send(Message(msg))
                except KeyError as e:
                    pass



async def banSb(gid: int, ban_list: list, time: int = None, scope: list = None):
    """
    构造禁言
    :param gid: 群号
    :param time: 时间（s)
    :param ban_list: at列表
    :param scope: 用于被动检测禁言的时间范围
    :return:禁言操作
    """
    time_string = ''
    # if 'all' in ban_list:
    #     yield nonebot.get_bot().set_group_whole_ban(
    #         group_id=gid,
    #         enable=True
    #     )
    # else:
    if time is None:
        if scope is None:
            time = random.randint(time_min, time_max)
        else:
            time = random.randint(scope[0], scope[1])
        time_string = set_timestring(time)
    for qq in ban_list:
        if int(qq) in super or str(qq) in super:
            await nonebot.get_bot().send_group_msg(group_id=gid, message="超管无法被禁言")
        else:
            if time > 0:
                await nonebot.get_bot().send_group_msg(group_id=gid, message=f"该用户已被禁言{time_string}")
            yield nonebot.get_bot().set_group_ban(
                group_id=gid,
                user_id=qq,
                duration=time,
            )


kick = on_command('踢', permission=SUPERUSER | GROUP_ADMIN | GROUP_OWNER, priority=1, block=True)
@kick.handle()
async def _(bot: Bot, event: GroupMessageEvent):
    """
    /踢 @user 踢出某人
    """
    msg = str(event.get_message())
    sb = At(event.json())
    gid = event.group_id
    if sb:
        if 'all' not in sb:
            try:
                for qq in sb:
                    await bot.set_group_kick(
                        group_id=gid,
                        user_id=int(qq),
                        reject_add_request=False
                    )
            except ActionFailed:
                await kick.finish("权限不足")
            else:
                await kick.finish(f"踢人操作成功")
        else:
            await kick.finish("不能含有@全体成员")


kick_ = on_command('黑', permission=SUPERUSER | GROUP_ADMIN | GROUP_OWNER, priority=1, block=True)
@kick_.handle()
async def _(bot: Bot, event: GroupMessageEvent):
    """
    黑 @user 踢出并拉黑某人
    """
    msg = str(event.get_message())
    sb = At(event.json())
    gid = event.group_id
    if sb:
        if 'all' not in sb:
            try:
                for qq in sb:
                    await bot.set_group_kick(
                        group_id=gid,
                        user_id=int(qq),
                        reject_add_request=True
                    )
            except ActionFailed:
                await kick_.finish("权限不足")
            else:
                await kick_.finish(f"踢人并拉黑操作成功")
        else:
            await kick_.finish("不能含有@全体成员")


ban = on_command('禁', priority=1, block=True, permission=SUPERUSER | GROUP_ADMIN | GROUP_OWNER)
@ban.handle()
async def _(bot: Bot, event: GroupMessageEvent):
    """
    /禁 @user 禁言
    """
    try:
        msg = MsgText(event.json()).replace(" ", "").replace("禁", "")
        time = int("".join(map(str, list(map(lambda x: int(x), filter(lambda x: x.isdigit(), msg))))))
        # 提取消息中所有数字作为禁言时间
    except ValueError:
        time = None
    sb = At(event.json())
    gid = event.group_id
    if sb:
        baning = banSb(gid, ban_list=sb, time=time)
        try:
            async for baned in baning:
                if baned:
                    await baned
        except ActionFailed:
            await ban.finish("权限不足")
        else:
            pass
            # if time is not None:
            #     await ban.finish("禁言操作成功")
            # else:
            #     await ban.finish("该用户已被禁言随机时长")
    else:
        pass


unban = on_command("解", priority=1, block=True, permission=SUPERUSER | GROUP_ADMIN | GROUP_OWNER)
@unban.handle()
async def _(bot: Bot, event: GroupMessageEvent):
    """
    /解 @user 解禁
    """
    sb = At(event.json())
    gid = event.group_id
    if sb:
        baning = banSb(gid, ban_list=sb, time=0)
        try:
            async for baned in baning:
                if baned:
                    await baned
        except ActionFailed:
            await unban.finish("权限不足")
        else:
            await unban.finish("解禁操作成功")

msg_recall = on_command("撤回", priority=1, aliases={"删除", "recall"}, block=True,
                        permission=SUPERUSER | GROUP_ADMIN | GROUP_OWNER)
@msg_recall.handle()
async def _(bot: Bot, event: GroupMessageEvent):
    """
    指令格式:
    /撤回 @user n
    回复指定消息时撤回该条消息；使用艾特时撤回被艾特的人在本群 n*19 历史消息内的所有消息。
    不输入 n 则默认 n=5
    """
    # msg = str(event.get_message())
    msg = MsgText(event.json())
    sb = At(event.json())
    rp = Reply(event.json())
    gid = event.group_id
    if not gid:  # FIXME: 有必要加吗？
        await msg_recall.finish("请在群内使用！")
    recall_msg_id = []
    if rp:
        recall_msg_id.append(rp["message_id"])
    elif sb:
        seq = None
        if len(msg.split(" ")) > 1:
            try:  # counts = n
                counts = int(msg.split(" ")[-1])
            except ValueError:
                counts = 5  # 出现错误就默认为 5 【理论上除非是 /撤回 @user n 且 n 不是数值时才有可能触发】
        else:
            counts = 5

        try:
            for i in range(counts):  # 获取 n 次
                await asleep(randint(0, 10))  # 睡眠随机时间，避免黑号
                res = await bot.call_api("get_group_msg_history", group_id=gid, message_seq=seq)  # 获取历史消息
                flag = True
                for message in res["messages"]:  # 历史消息列表
                    if flag:
                        seq = int(message["message_seq"]) - 1
                        flag = False
                    if int(message["user_id"]) in sb:  # 将消息id加入列表
                        recall_msg_id.append(int(message["message_id"]))
        except ActionFailed as e:
            await msg_recall.send(f"获取群历史消息时发生错误")
            print_exc()
    else:
        await msg_recall.finish("指令格式：\n/撤回 @user 撤回数量\n回复指定消息时撤回该条消息；使用@时撤回被@的人在本群 撤回数量*19 历史消息内的所有消息。\n不输入撤回数量则默认5")

    # 实际进行撤回的部分
    try:
        for msg_id in recall_msg_id:
            await asleep(randint(0, 3))  # 睡眠随机时间，避免黑号
            await bot.call_api("delete_msg", message_id=msg_id)
    except ActionFailed as e:
        await msg_recall.finish("执行失败，可能是我权限不足")
    else:
        await msg_recall.finish(f"操作成功，一共撤回了 {len(recall_msg_id)} 条消息")

def str_left(t, s):
    if isinstance(t, str) != True or isinstance(s, str) != True:
        return '传入参数有误'
    elif t.find(s) != -1:
        return t[0:t.find(s)]
    else:
        return ""

def str_right(t, s):
    if isinstance(t, str) != True or isinstance(s, str) != True:
        return '传入参数有误'
    elif t.rfind(s) != -1:
        return t[t.rfind(s) + len(s):len(t)]
    else:
        return ""

def set_timestring(set_time):
    """
    把秒转换成某天某时某分某秒
    :param set_time:
    :return:
    """
    time_string = ''
    day = set_time / 86400
    hours = set_time % 86400 / 3600
    minutes = set_time % 86400 % 3600 / 60
    seconds = set_time % 86400 % 3600 % 60
    if day >= 1:
        time_string += str(int(day)) + '天'
    if hours >= 1:
        time_string += str(int(hours)) + '时'
    if minutes >= 1:
        time_string += str(int(minutes)) + '分'
    if seconds >= 1:
        time_string += str(int(seconds)) + '秒'
    return time_string
```


# 网易云音乐插件

{% checkbox green checked, 支持点歌 %}
{% checkbox green checked, 支持下载 %}
{% checkbox green checked, 支持随机推荐 %}
{% checkbox green checked, 支持根据作者歌单随机推荐 %}

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/11 01:42
@Author  : superhero
@Email   : 838210720@qq.com
@File    : wyy.py
@IDE: PyCharm
"""
from nonebot import on_command
import nonebot
import execjs
import base64
import requests
import codecs
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from nonebot.adapters.onebot.v11 import Message
from nonebot.params import Arg, CommandArg, ArgPlainText
from lxml import etree
from nonebot.matcher import Matcher
import random

__plugin_meta__ = nonebot.plugin.PluginMetadata(
    name='网易云音乐',
    description='网易云音乐搜索下载',
    usage='''
    命令1/wyy/网易云音乐/点歌<参数：歌曲名,序号>不含下载
    命令2/wyys/网易云音乐s/下载<参数：歌曲名,序号>含下载
    命令3/pushy/歌曲推荐/推荐<参数：无>随机推荐
    命令4/pushys/歌曲推荐s/推荐s<参数：无>根据作者的歌单推荐
    ''',
    extra={'version': '1.3'}
)
__help_version__ = '1.3'


wyys = on_command("wyys", aliases={"网易云音乐s", "下载"}, priority=5)
# 点歌 不下载只能试听
@wyys.handle()
async def handle_first_receive(matcher: Matcher, args: nonebot.adapters.Message = CommandArg()):
    list_name = args.extract_plain_text().strip()
    if list_name:
        matcher.set_arg("music_name", args)

@wyys.got("music_name", prompt="你想下载的歌曲是？")
async def _(matcher: Matcher, music_name: nonebot.adapters.Message = Arg(), text: str = ArgPlainText("music_name")):
    if not text:
        await wyys.reject(music_name.template("待下载的歌曲名不能为空"))
    if "," in text:
        stt = text.split(",")
        name = stt[0]
        ids = stt[1]
        matcher.set_arg("id", Message(ids))
        matcher.set_arg("music_name", Message(name))
    elif "，" in text:
        stt = text.split("，")
        name = stt[0]
        ids = stt[1]
        matcher.set_arg("id", Message(ids))
        matcher.set_arg("music_name", Message(name))
    else:
        ids = '0'
        name = text

    wyy2 = WangYiYun()
    ret = wyy2.get_wyy_kwd(name)
    n = 0
    music_names = ''
    if ids != '0':
        music_id = ret['result']['songs'][(int(ids) - 1)]['id']
        if music_id:
            url = wyy2.get_wyy_playurl(music_id)
            await wyys.finish("[{0}]下载地址：".format(ret['result']['songs'][(int(ids) - 1)]['name']) + url)
        else:
            await wyys.finish("音乐ID获取失败")
    else:
        for i in ret['result']['songs']:
            n += 1
            music_names += '[{0}]'.format(n) + i['name'] + ' - ' + i['ar'][(int(ids) - 1)]['name'] + '\n'
            if n >= 10:
                break
        await wyys.send(music_names)

@wyys.got("id", prompt="请选择要下载第几个？")
async def _(music_name: nonebot.adapters.Message = Arg(), text: str = ArgPlainText("music_name"), ids: str = ArgPlainText("id")):
    if not ids:
        await wyys.reject(music_name.template("你还没有选择第几个哦"))
    wyy2 = WangYiYun()
    ret = wyy2.get_wyy_kwd(text)
    music_id = ret['result']['songs'][(int(ids) - 1)]['id']
    if music_id:
        url = wyy2.get_wyy_playurl(music_id)
        await wyys.finish("[{0}]下载地址：".format(ret['result']['songs'][(int(ids) - 1)]['name']) + url)
    else:
        await wyys.finish("音乐ID获取失败")




wyy = on_command("wyy", aliases={"网易云音乐", "点歌"}, priority=5)
# 点歌 不下载只能试听
@wyy.handle()
async def handle_first_receive(matcher: Matcher, args: nonebot.adapters.Message = CommandArg()):
    list_name = args.extract_plain_text().strip()
    if list_name:
        matcher.set_arg("music_name", args)

@wyy.got("music_name", prompt="你想搜索的歌曲是？")
async def _(matcher: Matcher, music_name: nonebot.adapters.Message = Arg(), text: str = ArgPlainText("music_name")):
    if not text:
        await wyy.reject(music_name.template("待搜索的歌曲名不能为空"))
    if "," in text:
        stt = text.split(",")
        name = stt[0]
        ids = stt[1]
        matcher.set_arg("id", Message(ids))
        matcher.set_arg("music_name", Message(name))
    elif "，" in text:
        stt = text.split("，")
        name = stt[0]
        ids = stt[1]
        matcher.set_arg("id", Message(ids))
        matcher.set_arg("music_name", Message(name))
    else:
        ids = '0'
        name = text

    wyy2 = WangYiYun()
    ret = wyy2.get_wyy_kwd(name)
    n = 0
    music_names = ''
    if ids != '0':
        music_id = ret['result']['songs'][(int(ids) - 1)]['id']
        msg = "[CQ:music,type=163,id={0}]".format(str(music_id))
        await wyy.finish(Message(msg))
    else:
        for i in ret['result']['songs']:
            n += 1
            music_names += '[{0}]'.format(n) + i['name'] + ' - ' + i['ar'][(int(ids) - 1)]['name'] + '\n'
            if n >= 10:
                break
        await wyy.send(music_names)

@wyy.got("id", prompt="请选择要播放第几个？")
async def _(music_name: nonebot.adapters.Message = Arg(), text: str = ArgPlainText("music_name"), ids: str = ArgPlainText("id")):
    if not ids:
        await wyy.reject(music_name.template("你还没有选择第几个哦"))
    # 这个肯定是没有获取到ids才执行的 所有需要把代码放在if里面 如果是用的finish也可以不放 用send肯定要放
    wyy2 = WangYiYun()
    ret = wyy2.get_wyy_kwd(text)
    music_id = ret['result']['songs'][(int(ids) - 1)]['id']
    msg = "[CQ:music,type=163,id={0}]".format(str(music_id))
    await wyy.finish(Message(msg))


song = on_command("pushy", aliases={"推荐", "歌曲推荐"}, priority=5)
@song.handle()
# 随机推荐
async def _():
    wyys = WangYiYun()
    listplay_id = wyys.get_wyy_pushy()
    msg = "[CQ:music,type=163,id={0}]".format(wyys.get_wyy_discover(listplay_id))
    await song.send(Message(msg))

songs = on_command("pushys", aliases={"推荐s", "歌曲推荐s"}, priority=5)
@songs.handle()
# 从作者的歌单中随机推荐
async def _():
    wyys = WangYiYun()
    listplay_id = ['/playlist?id=7480897649']
    msg = "[CQ:music,type=163,id={0}]".format(wyys.get_wyy_discover(listplay_id))
    await songs.send(Message(msg))

def to_16(key):
    while len(key) % 16 != 0:
        key += '\0'
    return str.encode(key)


def AES_encrypt(text, key, iv):
    bs = AES.block_size
    pad2 = lambda s: s + (bs - len(s) % bs) * chr(bs - len(s) % bs)
    encryptor = AES.new(to_16(key), AES.MODE_CBC, to_16(iv))

    pd2 = pad(str.encode(pad2(text)), 16)

    encrypt_aes = encryptor.encrypt(pd2)
    encrypt_text = str(base64.encodebytes(encrypt_aes), encoding='utf-8')
    return encrypt_text


def RSA_encrypt(text, pubKey, modulus):
    text = text[::-1]
    rs = int(codecs.encode(text.encode('utf-8'), 'hex_codec'), 16) ** int(pubKey, 16) % int(modulus, 16)
    return format(rs, 'x').zfill(256)





# 获取i值的函数，即随机生成长度为16的字符串
get_i = execjs.compile(r"""
    function a(a) {
        var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
        for (d = 0; a > d; d += 1)
            e = Math.random() * b.length,
            e = Math.floor(e),
            c += b.charAt(e);
        return c
    }
""")


class WangYiYun():
    def __init__(self):
        self.csrf_token = '' # 抓包填写自己的
        self.MUSIC_U = '' # 抓包填写自己的
        self.g = '0CoJUm6Qyw8W8jud'
        self.b = "010001"
        self.c = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
        self.i = get_i.call('a', 16)
        self.iv = "0102030405060708"
        # if not os.path.exists("d:/music"):
        #     os.mkdir('d:/music')
        self.ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'

    def get_encSecKey(self):
        return RSA_encrypt(self.i, self.b, self.c)

    def get_wyy_pushy(self):
        # 取随机列表
        url = 'https://music.163.com/discover'
        ret = requests.get(url, headers={"User-Agent": self.ua}).text
        soup = etree.HTML(ret)
        hot_id = soup.xpath('//ul[@class="m-cvrlst f-cb"]//li/div[@class="u-cover u-cover-1"]/a/@href')
        n = len(hot_id)
        bek = []
        # 去除电台dj
        for i in range(n):
            if "/dj" in hot_id[i]:
                bek.append(i)
        hot_id = [hot_id[i] for i in range(n) if (i not in bek)]
        return hot_id

    def get_wyy_discover(self, list_id):
        """
        从列表中随机取一首
        :param list_id: 列表id
        :return:
        """
        playlist_id = list_id[random.randint(0, len(list_id) - 1)]
        # 这里要添加自己的cookie 否则只能随机前10条
        cookie = ''
        ret = requests.get("https://music.163.com" + playlist_id, headers={"User-Agent": self.ua, "Cookie": cookie}).text
        soup = etree.HTML(ret)
        m_id = soup.xpath('//ul[@class="f-hide"]/li/a/@href')
        song_id = m_id[random.randint(0, len(m_id) - 1)][9:]
        return song_id



    def get_wyy_kwd(self, keyword):

        url = 'https://music.163.com/weapi/cloudsearch/get/web?csrf_token=' + self.csrf_token
        encText = str(
            {'hlpretag': '<span class=\"s-fc7\">', 'hlposttag': '</span>', '#/discover': '', 's': keyword, 'type': '1',
             'offset': "0", 'total': 'true', 'limit': '30', 'csrf_token': self.csrf_token})
        params = AES_encrypt(AES_encrypt(encText, self.g, self.iv), self.i, self.iv)
        data = {
            'params': params,
            'encSecKey': self.get_encSecKey()
        }

        header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'music.163.com',
            'Referer': 'https://music.163.com/search/',
            'User-Agent': self.ua
        }
        ret = requests.post(url, headers=header, data=data)
        # print('搜索结果', ret.text)
        return ret.json()

    def get_wyy_playurl(self, music_id):

        url = 'https://music.163.com/weapi/song/enhance/player/url?csrf_token=' + self.csrf_token
        encText = str({'ids': "[" + str(music_id) + "]", 'br': 128000, 'csrf_token': self.csrf_token,
                       'MUSIC_U': self.MUSIC_U})
        params = AES_encrypt(AES_encrypt(encText, self.g, self.iv), self.i, self.iv)
        data = {
            'params': params,
            'encSecKey': self.get_encSecKey()
        }
        headeer = {
            'User-Agent': self.ua,
            'Referer': 'https://music.163.com/',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        ret = requests.post(url, headers=headeer, data=data).json()
        download_url = ret['data'][0]['url']
        if download_url:
            try:
                msg = download_url
                # 根据音乐url地址，用urllib.request.retrieve直接将远程数据下载到本地
                # urllib.request.urlretrieve(download_url, 'd:/music/' + music_name+ '.mp3')
                # print('Successfully Download:'+music_name+ '.mp3')
            except:
                msg = '出错了~'
        else:
            msg = '获取失败'
        return msg
```

# 微博热搜插件

```python
import requests
from lxml import etree
from nonebot import on_command
import nonebot
from nonebot.adapters import Message
from nonebot.params import CommandArg
__plugin_meta__ = nonebot.plugin.PluginMetadata(
    name='微博热搜',
    description='获取微博热搜',
    usage='''命令/wbhot<参数：数量 默认10>''',
    extra={'version': '1.0'}
)
__help_version__ = '1.0'

weibohot = on_command("wbhot", aliases={"微博", "热搜"}, priority=5)
@weibohot.handle()
async def handle_first_receive(args: Message = CommandArg()):
    num = args.extract_plain_text()
    if not num:
        num = '10'
    url = 'https://passport.weibo.com/visitor/visitor?a=incarnate&t=LomBgTEURrl3AoXFT346PaH7q%2FNDphe9Xzpc1S3RCJ4%3D&w=2&c=095&gc=&cb=cross_domain&from=weibo&_rand=0.00811768666053514'
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
    }
    response = requests.get(url=url, headers=headers)
    cookie = requests.utils.dict_from_cookiejar(response.cookies)
    url = 'https://s.weibo.com/top/summary?cate=realtimehot'
    response = requests.get(url=url, headers=headers, cookies=cookie).text
    soup = etree.HTML(response)
    hot_name = soup.xpath('//div[@class="data"]//tr/td[@class="td-02"]/a/text()')
    hot_int = soup.xpath('//div[@class="data"]//tr/td[@class="td-02"]/span/text()')
    hot_url = soup.xpath('//div[@class="data"]//tr/td[@class="td-02"]/a/@href')
    n = 0
    txt = ''
    hot = '，热度：'
    for i in hot_name:
        hot_ints = hot_int[n - 1] if n > 0 else ''
        if int(num) > 15:
            txt = "{0}" + i + "{1}" + hot_ints + '\n 详情：https://s.weibo.com' + hot_url[n]
            txt = txt.format('【置顶】' if hot_ints == '' else str(n) + '.', '' if hot_ints == '' else hot)
            await weibohot.send(txt)
        else:
            txt += "{0}" + i + "{1}" + hot_ints + '\n 详情：https://s.weibo.com' + hot_url[n] + '\n'
            txt = txt.format('【置顶】' if hot_ints == '' else str(n) + '.', '' if hot_ints == '' else hot)
        n += 1
        if n >= (int(num) + 1):
            if int(num) <= 15:
                await weibohot.send(txt)
            break
```
# 抖音相关插件

- v1.4进一步优化了随机计算

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/13 6:01
@Author  : superhero
@Email   : 838210720@qq.com
@File    : douyin_video.py
@IDE: PyCharm
"""
import random
import requests
import re
from nonebot import on_command
from nonebot.params import CommandArg
from nonebot.adapters.onebot.v11 import GroupMessageEvent
import nonebot
from .config import plugin_config
from .switch import load, upload
from nonebot.typing import T_State

_path = plugin_config.douyin_path
__help_plugin_name__ = "抖音相关插件"
__help_version__ = '1.4'

__usage__ = '命令1/douyin/抖音/抖音解析<参数：视频链接>\n命令2/dyadd/抖音添加/dyset<参数：29位作者短链>\n命令3/dyget/记录美好生活/我要学习/我爱学习<参数：无>从添加的作者里面随机，绝不与上一次的内容重复'
header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'}
douyin = on_command("douyin", aliases={"抖音", "抖音解析"}, priority=5)


@douyin.handle()
async def _(args: nonebot.adapters.Message = CommandArg()):
    url = args.extract_plain_text()
    try:
        if len(url) <= 29:
            ret = requests.get(url, allow_redirects=False, headers=header)
            location = ret.headers['Location']
            vid = re.search(r'7\d{18}', location).group()
        else:
            vid = re.search(r'7\d{18}', url).group()
    except Exception:
        vid = ''
        await douyin.finish("链接有误，请输入视频链接")
    url = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=' + vid
    ret = requests.get(url, headers=header).json()
    if ret['item_list'][0]['aweme_type'] == 2:
        aweme_type = '图集'
        dow_url = ''
        duration = ''
        for i in ret['item_list'][0]['images']:
            dow_url += i['url_list'][0] + '\n'
    else:
        aweme_type = '视频'
        vid = ret['item_list'][0]['video']['vid']
        duration = '\n视频时长：' + str(round(ret['item_list'][0]['duration'] / 1000, 1)) + '秒'
        url = 'https://www.douyin.com/aweme/v1/play/?video_id=%s&line=0&is_play_url=1&source=PackSourceEnum_PUBLISH' % vid
        try:
            dow_url = get_shorten(url)
        except Exception:
            dow_url = url
    desc = ret['item_list'][0]['desc']
    author = ret['item_list'][0]['author']['nickname']
    music = ret['item_list'][0]['music']['play_url']['uri']
    await douyin.finish('播主：%s\n作品类型：%s\n标题：%s%s\n音频地址：%s\n下载地址：%s' % (author, aweme_type, duration, desc, music, dow_url))
    # await douyin.finish(MessageSegment.video(file=ret, timeout=5))


dyadd = on_command("dyget", aliases={"记录美好生活", "我要学习", "我爱学习"}, priority=5)


@dyadd.handle()
async def _(event: GroupMessageEvent):
    gid = str(event.group_id)
    funcs_status = (await load(_path))
    if funcs_status == None:
        await dyadd.finish("本群当前无数据，请先添加作者链接")

    url_list = funcs_status.get(gid, None)
    if url_list:
        # num = funcs_status.get('num', None) # 播主的索引
        # 保证下次随机的播主绝不和上次的一样 这里 -2 就行了 因为每次更新字典都会跑到最后我们躲避最后一个就不可能会取到她拉
        # 当然这个作者数少于2肯定会有异常的 我们做个异常处理
        # num = len(url_list)
        # try:
        #     num1 = random.randint(0, num - 2)
        # except Exception:
        #     num1 = 0
            # while num:
        #     if num != num1:
        #         break
        #     else:
        #         num1 = random.randint(0, len(url_list) - 1)

        # 其实直接不做随机 这样等于排队一样 第一个结束后在最后 第二个变成第一个以此类推 所以我们一直取第1个就好了
        num1 = 0

        url = url_list[num1]['url']
        num2 = url_list[num1].get('id', None) # 播主作品的索引
        ret = requests.get(url, allow_redirects=False, headers=header)
        sec_uid = get_str_btw(ret.headers['Location'], 'user/', '?')
        ret = requests.get(
            "https://www.iesdouyin.com/web/api/v2/aweme/post/?sec_uid={0}&count=30&max_cursor=0".format(sec_uid),
            headers=header).json()
        aweme_list = ret['aweme_list']
        num3 = random.randint(0, len(aweme_list) - 1)
        # 保证下次随机的播主作品绝不和上次的一样
        while num2:
            if num2 != num3:
                break
            else:
                num3 = random.randint(0, len(aweme_list) - 1)
        aweme_list = aweme_list[num3]
        if aweme_list['aweme_type'] == 2:
            duration = ''
            aweme_type = '图集'
            dow_url = ''
            url = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=' + aweme_list['aweme_id']
            ret = requests.get(url, headers=header).json()
            for i in ret['item_list'][0]['images']:
                dow_url += i['url_list'][0] + '\n'
        else:
            aweme_type = '视频'
            duration = '\n视频时长：' + str(round(aweme_list['video']['duration'] / 1000, 1)) + '秒'
            uri = aweme_list['video']['play_addr_lowbr']['uri']
            _url = 'https://www.douyin.com/aweme/v1/play/?video_id=%s&line=0&is_play_url=1&source=PackSourceEnum_PUBLISH' % uri
            try:
                dow_url = get_shorten(_url)
            except Exception:
                dow_url = _url

        # video_url = aweme_list['video']['play_addr_lowbr']['url_list'][0]
        author = aweme_list['author']['nickname']
        desc = aweme_list['desc']
        # music = aweme_list['video']['play_addr']['uri']
        gid_list = url_list[num1]
        url_list.remove(gid_list)
        gid_list.update({'id': num3})
        url_list.append(gid_list)
        # funcs_status.update({'num': num1})
        await upload(_path, funcs_status)
        await dyadd.finish(
            '播主：%s\n作品类型：%s   是播主的第%s个作品\n作品标题：%s%s\n下载地址：%s' % (author, aweme_type, str(num3+1), desc, duration, dow_url))
        # await dyadd.finish(MessageSegment.video(file=video_url, timeout=5) + video_url)
    else:
        await dyadd.finish("本群当前无数据，请先添加作者链接")


def get_str_btw(s, f, b):
    par = s.partition(f)
    return (par[2].partition(b))[0][:]


def get_shorten(url):
    header = {'User-Agent': 'com.ss.android.ugc.aweme/700 (Linux; U; Android 7.1.2; zh_CN; SM-G955F; Build/JLS36C; '
                            'Cronet/58.0.2991.0)'}
    link = 'https://lf-hl.snssdk.com/shorten/?target={0}&belong=aweme&persist=0&os_api=25&device_type=SM-G955F&' \
           'ssmix=a&manifest_version_code=700&dpi=240' \
           '&js_sdk_version=1.19.2.0&uuid=869120805765976&app_name=aweme&version_name=7.0.0&ts=1658322005&ac=wifi' \
           '&app_type=normal&channel=aweme_360&update_version_code=7002&_rticket=1658322005000&device_platform' \
           '=android&iid=3558489818144814&version_code=700&openudid=ea2310dc62938f1e&device_id=2854802376098695' \
           '&resolution=720*1280&device_brand=samsung&language=zh&os_version=7.1.2&aid=1128&mcc_mnc=46007'.format(url)
    ret = requests.get(link, headers=header).json()
    return ret['data']


dydel = on_command("dydel", aliases={"抖音删除"}, priority=5)
@dydel.handle()
async def _(event: GroupMessageEvent, state: T_State):
    gid = str(event.group_id)
    user_input_func_name = str(state['_prefix']['command_arg'])
    if len(user_input_func_name) != 29:
        await dydel.finish("请输入待删除的29位作者主页短链")
    funcs_status = (await load(_path))
    try:
        url_list = funcs_status[gid]
    except Exception:
        url_list = []
        await dydel.finish("被删除的内容不存在")
    n = 0
    idel = False
    for i in url_list:
        if i['url'] == user_input_func_name:
            idel = True
            url_list.pop(n)
            break
        n += 1
    if not idel:
        await dydel.finish("被删除的内容不存在")
    _val = {gid: url_list}
    funcs_status.update(_val)
    await upload(_path, funcs_status)
    await dydel.finish("已成功删除[%s]" % user_input_func_name)


dyadd = on_command("dyadd", aliases={"抖音添加", "dyset"}, priority=5)
@dyadd.handle()
async def _(event: GroupMessageEvent, state: T_State):
    gid = str(event.group_id)
    user_input_func_name = str(state['_prefix']['command_arg'])
    if len(user_input_func_name) != 29:
        await dyadd.finish("请输入29位作者主页短链")
    ret = requests.get(user_input_func_name, allow_redirects=False, headers=header)
    location = ret.headers['Location']
    if 'user' not in location:
        await dyadd.finish("检测到输入的链接不是作者主页短链")
    funcs_status = (await load(_path))
    gg = []
    if funcs_status != None:
        key = funcs_status
        url_list = key.get(gid, None)
        if url_list:
            for i in url_list:
                if user_input_func_name in i['url']:
                    await dyadd.finish("该作者已存在，请勿重复添加")
                    break
            for n in key[gid]:
                gg.append(n)
            kk = {"url": user_input_func_name}
            gg.append(kk)
            _val = {gid: gg}
            key.update(_val)
        else:
            kk = {"url": user_input_func_name}
            gg.append(kk)
            _val = {gid: gg}
            key.update(_val)
        await upload(_path, key)
        await dyadd.finish("抖音作者主页添加成功")
    else:
        kk = {"url": user_input_func_name}
        gg.append(kk)
        _val = {gid: gg}
        await upload(_path, _val)
        await dyadd.finish("抖音作者主页添加成功")

```
# 必应壁纸插件
{% checkbox green checked, 默认4K高清 %}
{% checkbox green checked, 支持7天以上壁纸 %}
- 我只是借用别人的网站来存下图片id而已怎么能说是爬虫呢

```python
import requests
from nonebot import on_command
import nonebot
from nonebot.params import CommandArg
from nonebot.adapters.onebot.v11 import Message
import datetime
from lxml import etree

__help_plugin_name__ = "必应每日一图"
__help_version__ = '1.2'
__usage__ = '命令/bing/必应壁纸<参数：1=今天-1天=昨天 默认0=今天>支持获取7天以上的壁纸'

bing = on_command("bing", aliases={"Bing", "BING", "壁纸", "必应壁纸"}, priority=5)
@bing.handle()
async def handle_first_receive(args: nonebot.adapters.Message = CommandArg()):
    day = args.extract_plain_text()
    days = 0
    if day:
        try:
            days = int(day)
        except ValueError:
            await bing.finish("参数错误，必须为数字默认为0取当天的壁纸")
    else:
        days = 0
    img_report, copyright, date = await get_bing(True, days)
    if date != '':
        st = list(date)
        st.insert(4, '.')
        st.insert(7, '.')
        date = ''.join(st)

    txt = '\n--来自：今日必应壁纸' if days == 0 else '\n--来自：{0}天前的必应壁纸'.format(days) if days <= 30 else '\n--来自：{0}的必应壁纸'.format(date)
    url = "[CQ:image,file="+img_report+"]"
    await bing.finish(Message(url) + copyright + txt)

async def get_bingbz(day):
    now = datetime.datetime.now()
    days = datetime.timedelta(days=day)
    _days = now - days
    _date = str(_days.year)+str(_days.month).zfill(2)+str(_days.day).zfill(2) # 计算x天前的时间
    _page = 1 if (day % 16) != 0 else 0 # 计算x天前在第几页，一页16个
    page = int(day / 16) + _page
    url = 'https://bing.xinac.net/?page={}'.format(page)
    ret = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ('
                                                   'KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'})
    if ret.status_code == 200:
        soup = etree.HTML(ret.text)
        # //*[@id="view_photoList"]/div[1]/div[1]/article/div[1]/a/div/img
        _post = soup.xpath('//*[@id="view_photoList"]//div/img/@data-date')
        _url = soup.xpath('//*[@id="view_photoList"]//div/img/@src')
        _alt = soup.xpath('//*[@id="view_photoList"]//div/img/@alt')
        n = 0
        if _date in _post: # 这里其实不用判断的 因为上面时间已经判断过了 但是保险起见嘛 无所谓
            for i in _post:
                if i == _date:
                    break
                n += 1
            res = await get_str_btw(_url[n], 'id=', '_400x240')
            copyright = _alt[n]
        else:
            res = '反正是失败了，'
            copyright = '不知道原因知道也不告诉你！'
        return res, copyright, _date

async def get_bing(uhd=False, day=0):
    """
    :param uhd:是否4k 默认否
    :param day: 0=今天 +1就是前一天
    :return:
    """
    date = ''
    if day > 7:
        img, copyright, date = await get_bingbz(day)
        url = 'https://cn.bing.com/th?id=' + img
        if not uhd:
            img = url + '_1920x1080.jpg'
        else:
            img = url + '_UHD.jpg'
    else:
        url = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx={0}&n=1'.format(day)
        ret = requests.get(url).json()
        img = ret['images'][0]['url']
        copyright = ret['images'][0]['copyright']
        if not uhd:
            img = 'https://cn.bing.com' + img
        else:
            img = 'https://cn.bing.com/th?id=' + await get_str_btw(img, 'id=', '_1920x1080') + '_UHD.jpg'
    return img, copyright, date


async def get_str_btw(s, f, b):
    par = s.partition(f)
    return (par[2].partition(b))[0][:]
```
# 历史上的今天

```python
from datetime import datetime
import requests
import re
import random
from nonebot import on_command
import nonebot
__plugin_meta__ = nonebot.plugin.PluginMetadata(
    name='历史上的今天',
    description='查询历史上的今天',
    usage='''命令/历史<参数：无>''',
    extra={'version': '1.0'}
)
__help_version__ = '1.0'

history = on_command("history", aliases={"历史", "历史上的今天"}, priority=5)
@history.handle()
async def handle_first_receive():
    ret = await get_history()
    await history.finish(ret)


async def get_history():
    times = datetime.now()
    day = str(times.day)
    day = day.zfill(2)
    month = str(times.month)
    month = month.zfill(2)
    url = 'https://baike.baidu.com/cms/home/eventsOnHistory/{0}.json'.format(month)
    ret = requests.get(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0'}).json()
    # print(ret)
    txt = ret[month][month + day]
    txt = txt[random.randint(0, len(txt) - 1)]
    txt = eval(re.sub(r'</?\w+[^>]*>', '', str(txt)))
    # data = {
    #     "type": "share",
    #     "data": {
    #         "url": txt['link'],
    #         "title": txt['year'] + '年' + month + '月' + day + '日，' + txt['title']
    #     }
    # }

    data = txt['year'] + '年' + month + '月' + day + '日\n' + txt['title'] + '\n详情点击：' + txt['link']
    return data

    # for i in ret[month][month + day]:
    #     n = eval(re.sub(r'</?\w+[^>]*>', '', str(i)))
    #     print(n['year'] + '年' + month + '月' + day + '日，' + n['title'])
    #     print(n['link'])

```

# 网易新闻插件

```python

import requests
from nonebot import on_command
import nonebot
from nonebot.adapters import Message
from nonebot.params import CommandArg
__plugin_meta__ = nonebot.plugin.PluginMetadata(
    name='新闻',
    description='获取网易热点新闻',
    usage='''命令/news<参数：数量 默认10>''',
    extra={'version': '1.0'}
)
__help_version__ = '1.0'

news = on_command("news", aliases={"新闻"}, priority=5)
@news.handle()
async def handle_first_receive(args: Message = CommandArg()):
    plain_text = args.extract_plain_text()
    if not plain_text:
        plain_text = '10'
    url = 'http://c.3g.163.com/nc/article/list/T1467284926140/0-20.html'
    ret = requests.get(url).json()
    n = 0
    msg = ''
    for i in ret['T1467284926140']:
        title = i['title']
        n += 1
        if int(plain_text) > 10:
            msg = str(n) + '.' + title + '--来源：' + i['source'] + '，时间：' + i['mtime'] + '\n' + '详情：' + i['url']
            await news.send(msg)
        else:
            msg += str(n) + '.' + title + '--来源：' + i['source'] + '，时间：' + i['mtime'] + '\n' + '详情：' + i['url'] + '\n'
        if int(n) >= int(plain_text):
            break
    if int(plain_text) <= 10:
        await news.finish(msg)
```

# gping插件

```python
import time
import struct
import socket
import select
from nonebot import on_command
import nonebot
from nonebot.adapters import Message
from nonebot.matcher import Matcher
from nonebot.params import Arg, CommandArg, ArgPlainText
import re

__plugin_meta__ = nonebot.plugin.PluginMetadata(
    name='PING域名或IP',
    description='PING 域名或IP',
    usage='''命令/ping<参数：域名或IP>''',
    extra={'version': '1.2'}
)
__help_version__ = '1.2'

getping = on_command("ping", aliases={"Ping", "PING"}, priority=5)


@getping.handle()
async def handle_first_receive(matcher: Matcher, args: Message = CommandArg()):
    music_name = args.extract_plain_text()
    if music_name:
        matcher.set_arg("ips", args)


@getping.got("ips", prompt="你想ping的域名或ip是？")
async def _(ips: Message = Arg(), ip: str = ArgPlainText("ips")):
    if not ip:
        await getping.reject(ips.template("ping的域名或ip为空"))
    ret = await ping(ip)
    await getping.finish(ret)


async def chesksum(data):
    n = len(data)
    m = n % 2
    sum = 0
    for i in range(0, n - m, 2):
        sum += (data[i]) + ((data[i + 1]) << 8)  # 传入data以每两个字节（十六进制）通过ord转十进制，第一字节在低位，第二个字节在高位
    if m:
        sum += (data[-1])
    # 将高于16位与低16位相加
    sum = (sum >> 16) + (sum & 0xffff)
    sum += (sum >> 16)  # 如果还有高于16位，将继续与低16位相加
    answer = ~sum & 0xffff
    #  主机字节序转网络字节序列（参考小端序转大端序）
    answer = answer >> 8 | (answer << 8 & 0xff00)
    return answer


async def request_ping(data_type, data_code, data_checksum, data_ID, data_Sequence, payload_body):
    #  把字节打包成二进制数据
    icmp_packet = struct.pack('>BBHHH32s', data_type, data_code, data_checksum, data_ID, data_Sequence, payload_body)
    icmp_chesksum = await chesksum(icmp_packet)  # 获取校验和
    #  把校验和传入，再次打包
    icmp_packet = struct.pack('>BBHHH32s', data_type, data_code, icmp_chesksum, data_ID, data_Sequence, payload_body)
    return icmp_packet


async def raw_socket(dst_addr, icmp_packet):
    '''
       连接套接字,并将数据发送到套接字
    '''
    # 实例化一个socket对象，ipv4，原套接字，分配协议端口
    rawsocket = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.getprotobyname("icmp"))
    # 记录当前请求时间
    send_request_ping_time = time.time()
    # 发送数据到网络
    rawsocket.sendto(icmp_packet, (dst_addr, 80))
    # 返回数据
    return send_request_ping_time, rawsocket, dst_addr


async def reply_ping(send_request_ping_time, rawsocket, data_Sequence, timeout=1):
    while True:
        # 开始时间
        started_select = time.time()
        # 实例化select对象，可读rawsocket，可写为空，可执行为空，超时时间
        what_ready = select.select([rawsocket], [], [], timeout)
        # 等待时间
        wait_for_time = (time.time() - started_select)
        # 没有返回可读的内容，判断超时
        if what_ready[0] == []:  # Timeout
            return -1
        # 记录接收时间
        time_received = time.time()
        # 设置接收的包的字节为1024
        received_packet, addr = rawsocket.recvfrom(1024)
        # 获取接收包的icmp头
        # print(icmpHeader)
        icmpHeader = received_packet[20:28]
        # 反转编码
        type, code, checksum, packet_id, sequence = struct.unpack(
            ">BBHHH", icmpHeader
        )

        if type == 0 and sequence == data_Sequence:
            return time_received - send_request_ping_time

        # 数据包的超时时间判断
        timeout = timeout - wait_for_time
        if timeout <= 0:
            return -1


async def ping(host):
    ret = ''
    ss = re.match(r'((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}', host)
    if ss is not None:
        if len(host) <= 9:
            return '别想了我不ping这个'
    start_time = time.time()
    send, accept, lost = 0, 0, 0
    sumtime, shorttime, longtime, avgtime = 0, 1000, 0, 0
    # TODO icmp数据包的构建
    data_type = 8  # ICMP Echo Request
    data_code = 0  # must be zero
    data_checksum = 0  # "...with value 0 substituted for this field..."
    data_ID = 0  # Identifier
    data_Sequence = 1  # Sequence number
    payload_body = b'abcdefghijklmnopqrstuvwabcdefghi'  # data

    # 将主机名转ipv4地址格式，返回以ipv4地址格式的字符串，如果主机名称是ipv4地址，则它将保持不变
    dst_addr = socket.gethostbyname(host)
    if host == '127.0.0.1' or host == 'localhost' or dst_addr == '127.0.0.1' or dst_addr == 'localhost':
        return '不能ping我'
    ret += "正在 Ping {0} [{1}] 具有 32 字节的数据:".format(host, dst_addr) + '\n'
    for i in range(0, 4):
        send = i + 1
        # 请求ping数据包的二进制转换
        icmp_packet = await request_ping(data_type, data_code, data_checksum, data_ID, data_Sequence + i, payload_body)
        # 连接套接字,并将数据发送到套接字
        send_request_ping_time, rawsocket, addr = await raw_socket(dst_addr, icmp_packet)
        # 数据包传输时间
        times = await reply_ping(send_request_ping_time, rawsocket, data_Sequence + i)
        if times > 0:
            ret += "来自 {0} 的回复: 字节=32 时间={1}ms".format(addr, int(times * 1000)) + '\n'

            accept += 1
            return_time = int(times * 1000)
            sumtime += return_time
            if return_time > longtime:
                longtime = return_time
            if return_time < shorttime:
                shorttime = return_time
            # time.sleep(0.2)
        else:
            lost += 1
            ret += "请求超时。\n"

        if send == 4:
            end_time = time.time()
            ret += "\t{0}的Ping统计信息:".format(dst_addr) + '\n'
            ret += "\t数据包：发送={0}，接收={1}，丢失={2}（{3}%丢失）\n往返行程的估计时间（以毫秒为单位）：\n\t最短={4}ms，最长={5}ms，平均={6}ms，ping耗时={7}ms".format(
                i + 1, accept, i + 1 - accept, (i + 1 - accept) / (i + 1) * 100, shorttime, longtime,
                sumtime / send, round((end_time - start_time) * 1000)) + '\n'
    return ret
```

# 防疫政策查询插件

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/13 5:43
@Author  : superhero
@Email   : 838210720@qq.com
@File    : yiqing.py
@IDE: PyCharm
"""

import requests
from nonebot import on_command
from nonebot.matcher import Matcher
from nonebot.params import Arg, CommandArg, ArgPlainText
from nonebot.adapters.onebot.v11 import Message
__help_plugin_name__ = "防疫政策查询"
__help_version__ = '1.0'
__usage__ = '命令/yiq/疫情<参数：准备去的城市>'

yiqing = on_command("yiq", aliases={"疫情"}, priority=5)

@yiqing.handle()
async def handle_first_receive(matcher: Matcher, args: Message = CommandArg()):
    plain_text = args.extract_plain_text()
    if plain_text:
        matcher.set_arg("city", args)

@yiqing.got("city", prompt="你准备去哪个城市呢？")
async def _(city: Message = Arg(), city_name: str = ArgPlainText("city")):
    if not city_name:
        await yiqing.reject(city.template("要查询的城市名称不能为空呢，请重新输入"))
    await yiqing.finish(ali_yiqing(city_name))

def ali_yiqing(city):
    url = 'https://vt.sm.cn/api/QuarkGoNew/getHomeData?to=' + city
    ret = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'}).json()
    small = ret['data']['to']['small'].get('coming_point_policy', None)
    n = 0
    msg = ''
    if small is None:
        msg = '失败了，请重试'
    else:
        for i in small:
            n += 1
            msg += str(n) + '.' + i + '\n'
    return msg
```
# 随机语录

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/17 1:17
@Author  : superhero
@Email   : 838210720@qq.com
@File    : saying.py
@IDE: PyCharm
"""

from nonebot import on_command
from nonebot.adapters.onebot.v11 import Message
import requests

__help_plugin_name__ = "随机语录"
__help_version__ = '1.0'
__usage__ = '命令1/saying/骚话 <参数：无>甜蜜的\n命令2/say/舔话 <参数：无>舔狗的'

saying = on_command("saying", aliases={"骚话"}, priority=5)
@saying.handle()
async def _():
    url = 'http://api.yanxi520.cn/api/xljtwr.php?charset=utf-8http://api.yanxi520.cn/api/xljtwr.php?encode=txt'
    text = requests.get(url=url).text
    await saying.send(Message(text))

say = on_command("say", aliases={"舔话"}, priority=5)

@say.handle()
async def _():
    url = 'http://api.yanxi520.cn/api/tiangou.php'
    text = requests.get(url=url).text
    await saying.send(Message(text))


```
# 淘宝优惠查询插件

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/13 22:37
@Author  : superhero
@Email   : 838210720@qq.com
@File    : tao.py
@IDE: PyCharm
"""
import re
import requests
import uuid
import time
import json
from nonebot import on_message
from nonebot.adapters.onebot.v11 import Bot, GroupMessageEvent, MessageEvent
from .config import global_config
__help_plugin_name__ = "淘宝商品优惠查询"
__help_version__ = '1.0'
__usage__ = '操作方式-打开淘宝-分享商品-复制链接到群内'

app_key = global_config.app_key

find_pic = on_message(priority=2, block=False)
@find_pic.handle()
async def check_pic(bot: Bot, event: GroupMessageEvent):
    # uid = [event.get_user_id()]
    gid = event.group_id
    # eid = event.message_id
    if isinstance(event, MessageEvent):
        for msg in event.message:
            if msg.type == "text":
                text: str = msg.data["text"]
                if '淘宝' in text and len(text) >= 44:
                    tid = get_tid(text)
                    await bot.send_group_msg(group_id=gid, message=get_taoinfo(tid))

def get_taoinfo(tid):
    url = 'https://openapi.dataoke.com/api/goods/get-goods-details?appKey=' + app_key + '&version=v1.2.3&goodsId=' + tid
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"}
    ret = requests.get(url, headers=header).json()
    if ret['msg'] == '淘宝id错误或无佣金':
        return '该商品无优惠'
    desc = ret['data']['title']
    link = ret['data']['itemLink']
    if not desc and link:
        return '获取优惠信息失败'
    uid = "".join(str(uuid.uuid4()).split("-")) + '.' + str(time.time() * 1000)
    data = {
        'eid': 150,
        'p': 1,
        'b': 8,
        'aid': 191,
        'uuid': uid,
        'title': desc,
        'v': '2.1.0',
        'url': link
    }

    url = 'https://pxapi.bntyh.com/v1/c'
    ret = requests.post(url, data=json.dumps(data), headers=header).json()

    msg = ret['data']['dtitle'] + '\n' + '优惠金额：' + ret['data']['couponPrice'] + '，优惠后：' + ret['data']['actual' \
          'Price'] + '，返利：' + ret['data']['Rebate'] + '，合计优惠：' + ret['data']['Discount'] + '\n' + '领券地址：' + ret['data']['couponLink']
    return msg

def get_tid(content):
    url = re.search(r'(https?)://[-A-Za-z\d+&@#/%?=~_|!:,.;]+[-A-Za-z\d+&@#/%=~_|]', content).group()
    if not url:
        return '输入的内容不含商品链接，请重新输入'
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"}
    ret = requests.get(url, headers=header).text
    url = re.search(r'(https?)://[-A-Za-z\d+&@#/%?=~_|!:,.;]+[-A-Za-z\d+&@#/%=~_|]', ret).group()
    tid = re.search(r'id=(.*?)&', url).group(1)
    return tid
```
# 每日微语早报插件

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/13 1:28
@Author  : superhero
@Email   : 838210720@qq.com
@File    : monpost.py
@IDE: PyCharm
"""

import requests
from datetime import datetime
from lxml import etree
import re
from nonebot import get_bots, require
from .config import plugin_config
from .switch import load, upload

__help_plugin_name__ = "每日微语早报"
__help_version__ = '1.6'
__usage__ = '每天6点50分自动运行，如果未更新早报将在30分钟后再次获取直到获取成功'

_path = plugin_config.admin_path
mon_path = plugin_config.mon_path

header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/75.0.3770.142 Safari/537.36'}

scheduler = require("nonebot_plugin_apscheduler").scheduler


async def set_job():
    (bot,) = get_bots().values()
    funcs_status = await load(_path)
    if funcs_status:
        for i in funcs_status:
            try:
                lf = funcs_status[i]['每日微语']
            except Exception:
                lf = False
            if lf:
                txt = await mon_post()
                try:
                    await bot.send_group_msg(group_id=int(i), message=txt)
                except Exception as e:
                    print(e, i + '这个群被禁言了跳过下一个')


async def up_job():
    is_send = await load(mon_path)
    if not is_send['is_send']:
        (bot,) = get_bots().values()
        funcs_status = await load(_path)
        if funcs_status:
            for i in funcs_status:
                try:
                    lf = funcs_status[i]['每日微语']
                except Exception:
                    lf = False
                if lf:
                    txt = await mon_post()
                    # time0 = datetime.now()
                    try:
                        if '当前还没有早报' in txt:
                            pass
                        else:
                            await bot.send_group_msg(group_id=int(i), message=txt)
                    except Exception as e:
                        print(e, i + '这个群被禁言了跳过下一个')


scheduler.add_job(set_job, "cron", hour=6, minute=50, id="set_job")
scheduler.add_job(up_job, "interval", minutes=30, id="up_job")


async def mon_post():
    time0 = datetime.now()
    uptime = time0.strftime("%Y-%m-%d")
    url = 'http://c.m.163.com/nc/subscribe/head/T1603594732083.html'
    ret = requests.get(url, headers=header).json()
    time1 = ret['tab_list'][0]['tab_data'][0]['ptime']
    time2 = datetime.strptime(time1, "%Y-%m-%d %H:%M:%S").strftime("%Y-%m-%d")
    if uptime != time2:
        # scheduler.resume_job(job_id='up_job')
        is_send = await load(mon_path)
        is_send['is_send'] = False
        await upload(mon_path, is_send)
        res = '截止%s，当前还没有早报，将循环获取直到成功后返回结果。\n早报来源：https://www.163.com/dy/media/T1603594732083.html' % \
              str(time0).split('.')[0]
    else:
        # scheduler.pause_job(job_id='up_job')
        is_send = await load(mon_path)
        is_send['is_send'] = True
        await upload(mon_path, is_send)
        url = ret['tab_list'][0]['tab_data'][0]['url']
        ret = requests.get(url, headers=header).text
        soup = etree.HTML(ret)
        _post = soup.xpath('//*[@id]/text()')
        _post1 = re.sub(r'\s', '', str(_post))
        _post1 = re.sub(r"'\\n',", "", _post1)
        _post1 = re.sub(r"\\u200b", "", _post1)
        _post = _post1.split(',')
        n = 0
        res = ''
        for i in _post:
            n += 1
            if n > 3 and i.find('365资讯简报') == -1 and i != ' ':
                res += i + '\n'
            if n > 21:
                break
        res = re.sub(r"'", '', res)
    return res
```
# 必应、百度、谷歌收录查询插件

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/21 0:34
@Author  : superhero
@Email   : 838210720@qq.com
@File    : record.py
@IDE: PyCharm
"""
import requests
from lxml import etree
import random
from urllib import parse
from nonebot import on_command
from nonebot.matcher import Matcher
from nonebot.params import Arg, CommandArg, ArgPlainText
from nonebot.adapters import Message
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver import ChromeOptions
from playwright.async_api import async_playwright


__help_plugin_name__ = "网址收录查询"
__help_version__ = '1.4'
__usage__ = '命令/record/收录查询<参数：url,机构名 => 百度，必应，google，all（全部）>\n示例/record https://app966.cn,all'

record = on_command("record", aliases={"收录查询"}, priority=5)


@record.handle()
async def handle_first_receive(matcher: Matcher, args: Message = CommandArg()):
    arr = args.extract_plain_text().strip()
    if arr:
        matcher.set_arg("org", args)


@record.got("org", prompt="请输入待查询的域名和机构名")
async def handle_city(org: Message = Arg(), arr: str = ArgPlainText("org")):
    if not arr:
        await record.reject(org.template("请输入域名以及查询机构，机构有：百度，必应，谷歌，all"))
    err = '输入的内容有误，请输入"/help 网址收录查询"获取帮助信息'
    if "," in arr:
        txt = arr.split(',')
    elif "，" in arr:
        txt = arr.split('，')
    else:
        txt = []
        await record.finish(err)

    if len(txt) <= 1:
        await record.finish(err)
    jg = txt[1]
    val = txt[0]
    if 'http' in val:
        val = parse.urlparse(val).netloc
    if jg == '百度' or jg == 'baidu':
        ret = '[' + val + ']百度收录结果如下：\n' + await baidu(val)
    elif jg == '必应' or jg == 'bing':
        async with async_playwright() as playwright:
            str_bing = await bing(playwright, val)
        ret = '[' + val + ']必应收录结果如下：\n' + str_bing
    elif jg == 'google' or jg == '谷歌':
        ret = '[' + val + ']谷歌收录结果如下：\n免费机器人不支持谷歌查询'
    elif jg == 'all':
        async with async_playwright() as playwright:
            str_bing = await bing(playwright, val)
        ret = '[' + val + ']的收录结果如下：\n百度：' + await baidu(val) + '\n必应：' + str_bing
    else:
        ret = err
    await record.finish(ret)

uadata = [
    'Mozilla/5.0 (Linux; Android 10; SKW-A0 Build/SKYW2001202CN00MQ0; wv) AppleWebKit/537.36 (KHTML, like Gecko) '
    'Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/11.20 SP-engine/2.16.0 baiduboxapp/11.20.0.14 (Baidu; P1 '
    '10)',
    'Mozilla/5.0 (Linux; Android 8.1.0; Redmi Note 5 Build/OPM1.171019.011; wv) AppleWebKit/537.36 (KHTML, '
    'like Gecko) Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/11.20 SP-engine/2.16.0 '
    'baiduboxapp/11.20.0.14 (Baidu; P1 8.1.0) NABar/2.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/13.0 '
    'MQQBrowser/10.1.1 Mobile/15B87 Safari/604.1 QBWebViewUA/2 QBWebViewType/1 WKType/1',
    'Mozilla/5.0 (Linux; Android 10; MI 9 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) '
    'Version/4.0 Chrome/67.0.3396.87 XWEB/1171 MMWEBSDK/200201 Mobile Safari/537.36 MMWEBID/2568 '
    'MicroMessenger/7.0.12.1620(0x27000C37) Process/tools NetType/4G Language/zh_CN ABI/arm64',
    'Mozilla/5.0 (Linux; Android 9; ONEPLUS A6000 Build/PKQ1.180716.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) '
    'Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/11.20 SP-engine/2.16.0 baiduboxapp/11.20.0.14 (Baidu; P1 '
    '9) NABar/2.0',
    'Mozilla/5.0 (Linux; U; Android 7.0; zh-cn; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10) AppleWebKit/537.36 (KHTML, '
    'like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/9.0 Mobile Safari/537.36 '
]


async def baidu(link):
    # link2 = link.split('.')
    # max = len(link2)
    # link3 = link if max < 3 else link2[max - 2] + "." + link2[max - 1]
    url = 'https://www.baidu.com/s?ie=utf-8&tn=baidu&wd=site%3A' + link
    header = {'User-Agent': random.choice(uadata)}
    ret = requests.get(url, headers=header).text
    soup = etree.HTML(ret)
    res = soup.xpath('//*[@id="content_left"]//div/p/b/text()')
    msg = res[0] if len(res) > 0 else '未收录'
    # print(msg)
    return msg


async def bing(p, link):
    browser = await p.chromium.launch(headless=False)
    context = await browser.new_context()
    page = await context.new_page()
    url = 'https://cn.bing.com/search?q=site%3A' + link
    await page.goto(url)
    try:
        res = await page.locator('xpath=//*[@id="b_tween"]/span[1]').text_content(timeout=2000)
    except Exception:
        res = '未收录'
    if not res:
        res = '未收录'
    return res


async def google(link):
    url = 'https://www.google.com/search?q=site%3A' + link
    options = ChromeOptions()
    # options.add_argument("--headless")
    options.add_argument('--incognito')
    options.add_argument('--blink-settings=imagesEnabled=false')
    browser = webdriver.Chrome(executable_path=r'C:\Program Files\Google\Chrome\Application\chromedriver.exe', options=options)
    browser.get(url)
    try:
        res = browser.find_element(By.XPATH, '//*[@id="result-stats"]').text
    except Exception:
        res = '未收录'
    browser.close()
    if not res:
        res = '未收录'
    return res
```

# 自助服务

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/9/8 7:11
@Author  : superhero
@Email   : 838210720@qq.com
@File    : service.py
@IDE: PyCharm
"""

from nonebot import on_command
from nonebot.matcher import Matcher
from nonebot.params import Arg, CommandArg, ArgPlainText
import nonebot
import random
import datetime
import aiofiles
from .config import plugin_config
from .switch import load, upload

__help_plugin_name__ = "自助服务"
__help_version__ = '1.1'
__usage__ = '请输入序号获取对应的服务\n1.解绑换绑\n2.今日价格'

bind_path = plugin_config.bind_path  # 记录解绑换绑次数
price_path = plugin_config.price_path  # 记录每日随机价格 价格随机尾数不含6,8,9否则导致容易被支付风控
binds_path = plugin_config.binds_path  # 记录待解绑换绑的账号

self_service = on_command("self-service", aliases={"自助服务"}, priority=5)
@self_service.handle()
async def _(matcher: Matcher, args: nonebot.adapters.Message = CommandArg()):
    list_name = args.extract_plain_text().strip()
    if list_name:
        matcher.set_arg("self", args)

@self_service.got("self", prompt="请输入序号获取对应的服务\n1.解绑换绑\n2.今日价格")
async def _(self: nonebot.adapters.Message = Arg(), text: str = ArgPlainText("self")):
    if not text:
        await self_service.reject(self.template("序号不能为空"))

    if int(text) == 1:
        pass
    elif int(text) == 2:
        funcs_status = await load(price_path)
        now = datetime.datetime.now()
        _date = str(now.year) + str(now.month).zfill(2) + str(now.day).zfill(2)
        if funcs_status.get(_date, None):
            await self_service.finish("今日价格：" + str(funcs_status[_date]))
        else:
            while True:
                price = random.randint(1100, 1400)
                if str(price)[-1] != '6' and str(price)[-1] != '8' and str(price)[-1] != '9' and str(price)[-1] != '0':
                    break
            funcs_status[_date] = price
            trend = '低' if price < 1200 else '均衡' if price < 1300 else '较高'
            await upload(price_path, funcs_status)
            await self_service.finish("今日价格：" + str(price) + '，价格趋势：' + trend)


@self_service.got("id", prompt="请输入待解绑的账号")
async def _(self: nonebot.adapters.Message = Arg(), ids: str = ArgPlainText("id")):
    if not ids or len(ids) < 6:
        await self_service.reject(self.template("请正确输入账号"))

    funcs_status = await load(bind_path)

    async with aiofiles.open(binds_path, 'r+', encoding='utf-8') as f:
        custom_limit_words = await f.read()
        rules = custom_limit_words.split('\n')
        if ids not in rules:
            if custom_limit_words == '':
                await f.write(ids)
            else:
                await f.write(custom_limit_words + '\n' + ids)
            await f.close()
        else:
            await self_service.finish("您的账号待解绑中，请勿重复提交")

    if funcs_status.get(ids, None):
        num = funcs_status[ids] + 1
        funcs_status[ids] = num
        await upload(bind_path, funcs_status)
        if 1 <= num <= 5:
            res = '扣除3天使用时间'
        elif 6 <= num <= 10:
            res = '扣除7天使用时间'
        else:
            res = '扣除15天使用时间'
        await self_service.finish(f"您是第{num}次解绑，解绑条件：{res}，本次解绑将在24小时内处理完毕")
    else:
        funcs_status[ids] = 1
        await upload(bind_path, funcs_status)
        await self_service.finish("您是首次解绑，解绑条件：无，本次解绑将在24小时内处理完毕")
```

# 配置文件

```python
from nonebot import get_driver
from pydantic import BaseModel, Extra
import os

class Config(BaseModel, extra=Extra.ignore):
    ban_rand_time_min: int = 60  # 随机禁言最短时间(s) default: 1分钟
    ban_rand_time_max: int = 86400  # 随机禁言最长时间(s) default: 3天: 60*60*24*3
    config_group_admin: bool = True  # 是否自动同意入群请求
    answer: list = ['app966.cn', '916790180']  # 需要正确回答问题才能入群
    answer_int: int = 8  # 问题的答案长度不小于x才能入群 两者为或者关系 满足其一即可让他入群
    bot_id: int = 690518713  # 机器人qq号
    # 如果要唯一关系把答案长度改为较大的数或把答案设为复杂类型
    _path = os.path.abspath('.')
    admin_path: str = _path + "\\admin.json"  # 默认{}
    douyin_path: str = _path + "\\douyin.json"  # 默认{}
    mon_path: str = _path + "\\mon_post.json"  # 默认{"is_send": false}
    jin_path: str = _path + "\\f_word_s.txt"
    price_path: str = _path + "\\price.json"  # 默认{}
    bind_path: str = _path + "\\bind.json"  # 默认{}
    binds_path: str = _path + "\\bind.txt"
    keys: list = ['防撤回', '进退提示', '每日微语', '违禁词检测', '加群处理']


global_config = get_driver().config
plugin_config = Config.parse_obj(global_config)
```

# 开关按钮

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/17 4:43
@Author  : superhero
@Email   : 838210720@qq.com
@File    : switch.py
@IDE: PyCharm
"""

from nonebot_plugin_txt2img import Txt2Img
from nonebot import on_command
from nonebot.typing import T_State
from nonebot.adapters.onebot.v11.permission import GROUP_ADMIN, GROUP_OWNER
from nonebot.adapters.onebot.v11 import GroupMessageEvent, MessageSegment
from nonebot.permission import SUPERUSER
import nonebot
from nonebot.params import CommandArg
import json
from typing import Union, List
import aiofiles
from .config import plugin_config
import re

__help_plugin_name__ = "开关按钮"
__help_version__ = '1.4'
__usage__ = '命令1/开关 <参数：要开关的功能> 目前支持：防撤回,进退提示,每日微' \
            '语,违禁词检测,加群处理[需要把机器人设为管理员]\n命令2/开关状态 <参数：无>\n命令3/添加违禁词 <参数：违禁词>'

_path = plugin_config.admin_path
_val = plugin_config.keys
jin_path = plugin_config.jin_path

async def load(path):
    """
    加载json文件
    :return: dict
    """
    try:
        async with aiofiles.open(path, mode='r', encoding="utf-8") as f:
            contents_ = await f.read()
            if contents_.startswith(u'\ufeff'):
                contents_ = contents_.encode('utf8')[3:].decode('utf8')
            contents = json.loads(contents_)
            await f.close()
            return contents
    except FileNotFoundError:
        return None


async def upload(path, dict_content) -> None:
    """
    更新json文件
    :param path: 路径
    :param dict_content: python对象，字典
    """
    async with aiofiles.open(path, mode='w', encoding="utf-8") as c:
        await c.write(str(json.dumps(dict_content, ensure_ascii=False)))
        await c.close()

add_sao = on_command("添加违禁词", priority=1, block=True, permission=SUPERUSER | GROUP_ADMIN | GROUP_OWNER)
@add_sao.handle()
async def _(event: GroupMessageEvent, args: nonebot.adapters.Message = CommandArg()):
    _sao = args.extract_plain_text()
    if not _sao:
        await add_sao.finish("出错啦，你还没有添加违禁词")
    if len(_sao) > 5:
        await add_sao.finish("违禁词宜短不宜长，你输入的太长了")
    gid = str(event.group_id)
    funcs_status = (await load(_path))
    async with aiofiles.open(jin_path, 'r+', encoding='utf-8') as f:
        custom_limit_words = await f.read()
        rules = [re.sub(r'\t+', '\t', rule).split('\t') for rule in
                 custom_limit_words.split('\n')]
        if _sao in rules:
            await f.close()
            await add_sao.finish("这个违禁词已经添加过啦，请不要重复添加！")
        else:
            await f.write(custom_limit_words + '\n' + _sao)
            try:
                lfc = funcs_status[gid]['违禁词检测']
            except Exception:
                lfc = False
            we = '，你还没有开启违禁词检测哦！'
            if lfc:
                we = ''
            msg = '违禁词添加成功' + we
            await f.close()
            await add_sao.finish(msg)



switcher = on_command("开关", priority=1, block=True, permission=SUPERUSER | GROUP_ADMIN | GROUP_OWNER)
@switcher.handle()
async def _(event: GroupMessageEvent, state: T_State):
    gid = str(event.group_id)
    user_input_func_name = str(state['_prefix']['command_arg'])
    if user_input_func_name in _val:
        funcs_status = await load(_path)
        if funcs_status != None:
            key = funcs_status
            if not funcs_status.get(gid, None):
                kk = {}
                for n in _val:
                    kk.update({n: True})
                    key.update({gid: kk})
                await upload(_path, key)
                await switcher.finish("已开启" + user_input_func_name)
            else:
                try:
                    lf = funcs_status[gid][user_input_func_name]
                except Exception:
                    lf = False
                    funcs_status.update({user_input_func_name: lf})
                    await upload(_path, funcs_status)

                if lf:
                    funcs_status[gid][user_input_func_name] = False
                    await upload(_path, funcs_status)
                    await switcher.finish("已关闭" + user_input_func_name)
                else:
                    funcs_status[gid][user_input_func_name] = True
                    await upload(_path, funcs_status)
                    await switcher.finish("已开启" + user_input_func_name)

        else:
            key = {}
            kk = {}
            for n in _val:
                kk.update({n: True})
                key.update({gid: kk})
            await upload(_path, key)
            await switcher.finish("已开启" + user_input_func_name)
    else:
        pluginfo = ''
        for n in _val:
            pluginfo += n + '\n'
        await switcher.finish("只支持被动插件\n意指不需要主动输入命令唤醒的插件\n目前支持的被动插件有：\n" + pluginfo)


switcher_html = on_command("开关状态", priority=1, block=True)
@switcher_html.handle()
async def _(event: GroupMessageEvent):
    gid = str(event.group_id)
    funcs_status = (await load(_path))
    data = funcs_status.get(gid, '')
    if not data:
        await switcher.finish("本群没有开启的被动插件")
    else:
        pluginfo = ''
        for n in data:
            state = "已激活" if data[n] else "已关闭"
            if n == '违禁词检测' or n == '加群处理':
                state = state + '[需管理权限]'
            pluginfo += n + '：' + state + '\n'
        font_size = 32
        title = '被动插件开关状态'
        text = pluginfo
        img = Txt2Img(font_size)
        pic = img.save(title, text)
        await switcher.finish(MessageSegment.image(pic))


def At(data: str) -> Union[List[str], List[int], list]:
    """
    检测at了谁，返回[qq, qq, qq,...]
    包含全体成员直接返回['all']
    如果没有at任何人，返回[]
    :param data: event.json
    :return: list
    """
    try:
        qq_list = []
        data = json.loads(data)
        for msg in data["message"]:
            if msg["type"] == "at":
                if 'all' not in str(msg):
                    qq_list.append(int(msg["data"]["qq"]))
                else:
                    return ['all']
        return qq_list
    except KeyError:
        return []

def Reply(data: str):
    """
    检测回复哪条消息，返回 reply 对象
    如果没有回复任何人，返回 None
    :param data: event.json()
    :return: dict | None
    """
    try:
        data = json.loads(data)
        if data["reply"] and data["reply"]["message_id"]:  # 待优化
            return data["reply"]
        else:
            return None
    except KeyError:
        return None


def MsgText(data: str):
    """
    返回消息文本段内容(即去除 cq 码后的内容)
    :param data: event.json()
    :return: str
    """
    try:
        data = json.loads(data)
        # 过滤出类型为 text 的【并且过滤内容为空的】
        msg_text_list = filter(lambda x: x["type"] == "text" and x["data"]["text"].replace(" ", "") != "",
                               data["message"])
        # 拼接成字符串并且去除两端空格
        msg_text = " ".join(map(lambda x: x["data"]["text"].strip(), msg_text_list)).strip()
        return msg_text
    except:
        return ""
```
# chatGPT插件
```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/12/9 12:29
@Author  : superhero
@Email   : 838210720@qq.com
@File    : chatgpt.py
@IDE: PyCharm
"""

from nonebot import on_command, on_message
import nonebot
from nonebot.params import CommandArg
from nonebot.adapters.onebot.v11 import Message, MessageEvent
import openai
import json

__help_plugin_name__ = "openai人工智能"
__help_version__ = '1.0'
__usage__ = '命令1./ai <参数：你想咨询的内容>\n命令2./img <参数1：你想生成的图片类型，参数2：生成的数量；默认1，参数3：图片大小；默认256*256,1=512*512,2=1024*1024\n命令3."""这里输入要生成的代码内容""">'

chatgpt_text = on_command("ai", aliases={"AI"}, priority=1)
@chatgpt_text.handle()
async def _(args: nonebot.adapters.Message = CommandArg()):
    text = args.extract_plain_text()
    if text:
        ai = chatGPT()
        res = ai.set_text(text)
        json_data = json.loads(res)
        await chatgpt_text.finish(json_data['choices'][0]['text'])
    else:
        await chatgpt_text.finish('请输入你想咨询的问题')

chatgpt_img = on_command("img", aliases={"img"}, priority=1)
@chatgpt_img.handle()
async def _(args: nonebot.adapters.Message = CommandArg()):
    text = args.extract_plain_text()
    if text:
        if "," in text:
            stt = text.split(",")
            if len(stt) == 3:
                content = stt[0]
                x = stt[1]
                n = stt[2]
            elif len(stt) == 2:
                content = stt[0]
                x = stt[1]
                n = 0
            else:
                content = stt[0]
                x = 1
                n = 0

        else:
            content = text
            x = 1
            n = 0

        ai = chatGPT()
        res = ai.set_img(content, int(x), int(n))
        json_data = json.loads(res)
        for i in json_data['data']:
            cq = "[CQ:image,file=%s]" % i['url']
            await chatgpt_img.send(Message(cq))
    else:
        await chatgpt_img.finish('请输入你想生成的图片类型')


chatgpt_code = on_message(priority=2, block=False)
@chatgpt_code.handle()
async def _(event: MessageEvent):
    if isinstance(event, MessageEvent):
        for msg in event.message:
            if msg.type == "text":
                text: str = msg.data["text"]
                s_list = text.split('"""')
                if len(s_list) >= 3:
                    ai = chatGPT()
                    res = ai.set_code(text, 0)
                    json_data = json.loads(res)
                    await chatgpt_code.finish(json_data['choices'][0]['text'])

class chatGPT():
    def __init__(self):
        openai.organization = "org-7YALDPRtMrCFNt7HpK5Wc8Z5"
        openai.api_key = "sk-xxx"  # https://openai.com/自己申请啊，免费的
        # model_list = openai.Model.list()
        # print(model_list)

    def set_text(self, content) -> str:
        res = openai.Completion.create(
            model="text-davinci-003",
            prompt=content,
            temperature=0.9,
            max_tokens=3900,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0.6
        )
        return str(res)

    def set_code(self, content, n=1) -> str:
        model = "code-cushman-001" if n == 1 else "code-davinci-002"
        x = 2000 if model == "code-cushman-001" else 300
        res = openai.Completion.create(
            model=model,
            prompt=content,
            temperature=0,
            max_tokens=x,
            top_p=1,
        )
        return str(res)

    def set_img(self, content, x=1, n=0) -> str:
        """
        生成图片
        :param content: 图片内容
        :param x: 图片数
        :param n: 尺寸
        :return:
        """
        size = '256x256' if n == 0 else '512x512' if n == 1 else '1024x1024'
        res = openai.Image.create(
            prompt=content,
            n=x,
            size=size
        )
        return str(res)

if __name__ == '__main__':
    ai = chatGPT()
    res = ai.set_code('"""1. Create a list of first names2. Create a list of last names3. Combine them randomly into a list of 100 full names"""',0)
    print(res)
```


# Butterfly友链检查（非插件）
- 懒得再开一贴了直接藏在这了

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/7/14 22:13
@Author  : superhero
@Email   : 838210720@qq.com
@File    : friendins.py
@IDE: PyCharm
"""

import requests
from lxml import etree
import re
from urllib import parse
# 不支持友链大魔改的博客
# 准确率大概百分之90 有的友链是通过接口形式这个无法查询到

"""
另外，有想加友链的可以先添加
name： Superhero
link： https://www.app966.cn/
avatar： https://www.app966.cn/img/qq.jpg
descr： 夜色难免黑凉，前行必有曙光
"""

def get_link(url, ss=False):
    """
    检查自己的友链状态
    :param url: 输入自己的博客友链
    :param ss: 是从自己的博客友链获取还是自己添加去查询对方是否添加了自己，默认从自己博客获取
    :return:
    """
    # 发现有些博客有检查user-agent，所以加上这个
    header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                            'Chrome/75.0.3770.142 Safari/537.36'}
    if ss is False:

        ret = requests.get(url, headers=header).content.decode('utf8')
        # print(ret)
        soup = etree.HTML(ret)
        # //*[@id="article-container"]/div/div[2]/div[1]/a
        # //*[@id="article-container"]/div/div[4]/div[1]/a/div[2]title cf-friends-name
        # //*[@id="article-container"]/div/div[1]/div[1]/a[1]/div[2]/span[1]
        friend_url = soup.xpath('//*[@id="article-container"]//@href')
        # friend_name = soup.xpath('//*[@id="article-container"]//div/a/div[@class="flink-item-name"]/text()')
        # 名字位置都不一样 就不判断了
        # friend_name = soup.xpath('//*[@id="article-container"]//span[@class="title"]/text()')
        # print(friend_name)
        urls = re.findall(r'(?:http.?)://[-A-Za-z\d+&@#/%?=~_|!:,.;]+[-A-Za-z\d+&@#/%=~_|]', str(friend_url))
        if not urls:
            return "只支持Butterfly主题，只支持不魔改友链的"
    else:
        urls = ['想查对方是否有你在这输入对方的友链地址1', '想查对方是否有你在这输入对方的友链地址2']

    n = len(urls)
    x = 0
    d = 0
    d1 = 0
    d2 = 0

    success = ''
    none = ''
    error = ''
    import urllib3
    urllib3.disable_warnings()
    print("检查开始了，你一共有[%s]个友链" % n)
    for i in urls:
        x += 1
        friend_url = i
        url1 = parse.urlparse(url).netloc
        url2 = url1.split('.')
        max = len(url2)
        url3 = url1 if max < 3 else url2[max-2] + "." + url2[max-1]
        if url3 in friend_url:
            print((friend_url + "：第[{0}]个，自己就不检查了撒").format(str(x)))
        else:
            if ss is False:
                # 自己输入就不用加/link路径了
                if friend_url[len(friend_url) - 1:] == '/':
                    friend_url += 'link/'
                else:
                    friend_url += '/link/'
            # if 'https' in friend_url:
            #     friend_url = 'http' + friend_url[5:]
            try:
                ret = requests.get(friend_url, timeout=3, headers=header, verify=False)
                if not ret.status_code == 200:
                    d += 1
                    error += friend_url + '\n'
                    print(("第[{0}]个，链接有误，可能友链不是link，进度：" + str(round(x / n * 100, 1)) + "%").format(str(x)))
                else:
                    # soup = etree.HTML(ret.text)
                    # ffriend_url = soup.xpath('//*[@id="article-container"]//@href')
                    if url1 in str(ret.text):
                        d1 += 1
                        success += friend_url + '\n'
                        print(("第[{0}]个，添加我了，进度：" + str(round(x / n * 100, 1)) + "%").format(str(x)))
                    else:
                        d2 += 1
                        none += friend_url + '\n'
                        print(("第[{0}]个，没有添加我，进度：" + str(round(x / n * 100, 1)) + "%").format(str(x)))
            except Exception as e:
                print(e)



    print('统计结果：\n链接有误的有%s个，其中添加了我的有%s个，没有添加我的有%s个\n' % (str(d), str(d1), str(d2)) + '添加了我的：\n' + success + '未添加我的：\n' + none + '链接可能存在错误的：\n' + error)

def get_str_btw(s, f, b):
    par = s.partition(f)
    return (par[2].partition(b))[0][:]

if __name__ == '__main__':
    # 输入待检查的博客友链地址即可
    url = 'https://app966.cn/link/'
    get_link(url)
```