import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Account


# Create your views here.
def get_home(request):
    return render(request, "home.html")


@ensure_csrf_cookie
def add_account(request):
    if request.method == 'POST' or request.method == 'GET':
        data = json.loads(request.body)
        newAccount = Account(name=data["name"], phone=data["phone"], address=data["address"], username=data["username"],
                             password=data["password"], role=data["role"], parking_fee=data["parking_fee"], )
        newAccount.save()
        return HttpResponse(status=404)
    else:
        return HttpResponse(status=204)


@ensure_csrf_cookie
def update_account(request):
    data = json.loads(request.body)
    id = data["id"]
    try:
        account = Account.objects.get(id=id)
    except Account.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'PUT':
        account.name = data["name"]
        account.phone = data["phone"]
        account.address = data["address"]
        account.username = data["username"]
        account.password = data["password"]
        account.role = data["role"]
        account.parking_fee = data["parking_fee"]
        account.save()
        return HttpResponse(status=204)


@ensure_csrf_cookie
def delete_account(request):
    data = json.loads(request.body)
    id = data["id"]
    try:
        account = Account.objects.get(id=id)
    except Account.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'DELETE':
        account.delete()
        return HttpResponse(status=204)


@ensure_csrf_cookie
def view_all_accounts(request):
    if request.method == 'GET':
        accounts = Account.objects.all()
        data = {
            'accounts': list(accounts.values())
        }
        return JsonResponse(data, safe=False)


def view_account(request, account_id):
    if request.method == 'GET':
        try:
            user = Account.objects.get(id=account_id)
            data = {
                'id': user.id,
                'name': user.name,
                'phone': user.phone,
                'address': user.address,
                'username': user.username,
                'password': user.password,
                'role': user.role,
                'parking_fee': user.parking_fee,

                # add any other fields you want to include in the response
            }
            return JsonResponse(data)
        except Account.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)