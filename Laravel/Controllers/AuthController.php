<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Mail\NewPassword;
use App\Mail\RegisterConfirmation;
use App\Models\User;
use App\Repository\UserRepository\UserInterface;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

class AuthController extends Controller
{
    private UserInterface $userRepository;
    private AuthService $authService;

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct(UserInterface $userRepository, AuthService $authService)
    {
        $this->userRepository = $userRepository;
        $this->authService = $authService;
    }

    /**
     * Get a JWT via given credentials.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (! $token = auth()->attempt($request->validated())) {
            return $this->jsonResponse(['error' => 'Unauthorized'], 401);
        }

        if (auth()->user()->registration_status == 0) {
            return $this->jsonResponse(['message' => 'Please confirm your email address first']);
        }

        return $this->authService->respondWithToken($token);
    }

    /**
     * Register a User.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create(array_merge($request->validated(), ['password' => bcrypt($request->password)]));

        $user->assignRole('user');

        Mail::to($request->email)->send(new RegisterConfirmation($user));

        return $this->jsonResponse([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        auth()->logout();

        return $this->jsonResponse(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return JsonResponse
     */
    public function refresh(): JsonResponse
    {
        $list = Route::getRoutes();
        foreach ($list->getRoutes() as $route) {
            $routeList[] = $route->uri;
        }

        return $this->jsonResponse($routeList);

        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return JsonResponse
     */
    public function userProfile(): JsonResponse
    {
        return $this->jsonResponse(auth()->user());
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $user = $this->userRepository->getByEmail($request->email);

        if (isset($user[0])) {
            Mail::to($user->email)->send(new NewPassword($user[0]));
        }

        return $this->jsonResponse(auth()->user());
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function setNewPassword(Request $request): JsonResponse
    {
        if (! $request->hasValidSignature()) {
            abort(401);
        }

        return $this->jsonResponse(auth()->user());
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function activateAccount(Request $request): JsonResponse
    {
        if (! $request->hasValidSignature()) {
            abort(401);
        }

        $this->userRepository->update($request->confirmation, ['registration_status' => 1]);

        return $this->jsonResponse(['message' => 'Your account is active']);
    }
}
